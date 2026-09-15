# unbonded_embed.R -----------------------------------------------------------
#
# Makes a Shiny app resize itself inside the Unbonded Archive website.
# The React <ShinyEmbed> component (src/features/dashboards/ShinyEmbed.tsx) listens
# for these messages and sets the iframe height, so the dashboard has no inner
# scrollbar and looks native on phones.
#
# Usage in app.R:
#
#   source("unbonded_embed.R")
#
#   ui <- fluidPage(
#     unbonded_embed_head(),
#     titlePanel("Kamaiya rehabilitation indicators"),
#     sidebarLayout(sidebarPanel(...), mainPanel(...))
#   )
#
# Layout tips for mobile:
#   * Prefer fluidPage()/bslib::page_fluid(). Avoid "fillable" pages
#     (page_fillable, page_sidebar with fillable = TRUE) in auto-height mode:
#     they size themselves to the iframe, and the iframe sizes itself to them.
#   * Give plots a fixed pixel height, e.g. plotOutput("trend", height = "360px").
#   * Leaflet maps: leafletOutput("map", height = 420).
#
# Low-bandwidth tips:
#   * Pre-aggregate data with dplyr before deploying; ship .rds/.parquet summaries,
#     not raw survey microdata.
#   * Prefer static ggplot2 PNGs (renderPlot) over plotly/htmlwidgets where
#     interactivity isn't essential: each htmlwidget adds several hundred KB of JS.
#   * bindCache() on expensive renderers so repeat visitors don't recompute.
# ------------------------------------------------------------------------------

unbonded_embed_head <- function(
  parent_origins = c("https://unbondedarchive.org", "https://www.unbondedarchive.org", "http://localhost:5173")
) {
  origins_js <- jsonlite::toJSON(parent_origins, auto_unbox = FALSE)

  shiny::tags$head(
    shiny::tags$meta(name = "viewport", content = "width=device-width, initial-scale=1"),
    # When embedded, the page must size to its content, not to the iframe. The class is
    # added by the script below, so the app still scrolls normally when opened directly.
    shiny::tags$style(shiny::HTML(".unbonded-embedded, .unbonded-embedded body { height: auto !important; min-height: 0 !important; overflow-y: hidden; }")),
    shiny::tags$script(shiny::HTML(sprintf("
(function () {
  if (window.parent === window) return;            // opened directly, not embedded
  document.documentElement.classList.add('unbonded-embedded');
  var origins = %s;
  var lastHeight = 0;
  var frame = null;

  function report() {
    frame = null;
    var height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - lastHeight) < 2) return;  // ignore sub-pixel jitter
    lastHeight = height;
    origins.forEach(function (origin) {
      // postMessage silently drops messages whose target origin doesn't match the parent.
      window.parent.postMessage({ type: 'unbonded:shiny-resize', height: height }, origin);
    });
  }
  function schedule() { if (frame === null) frame = requestAnimationFrame(report); }

  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  window.addEventListener('load', schedule);
  // Outputs re-render after inputs change; re-measure when Shiny settles.
  if (window.jQuery) jQuery(document).on('shiny:idle shiny:value shiny:visualchange', schedule);
})();
", origins_js)))
  )
}
