# Articles

Each volunteer article is one Markdown (`.md`) file in this folder. Publishing one:

1. Review the submission from the Google Form (linked on the site's **Write for us** page).
2. Copy `_template.md` to a new file named after the article, in lowercase with hyphens,
   e.g. `kamaiya-land-twenty-years-on.md`. The filename becomes the web address:
   `unbondedarchive.org/articles/kamaiya-land-twenty-years-on`.
3. Fill in the details between the two `---` lines, then paste the article text below them.
4. Commit and push to `main`. GitHub Pages redeploys the site in about a minute.

## Details at the top of each file

| Field | Required | What to put |
|---|---|---|
| `title` | yes | The article's title |
| `author` | yes | Name as the author wants it shown |
| `date` | yes | Publication date as `YYYY-MM-DD` (newest articles are listed first) |
| `summary` | recommended | One or two sentences shown in the article list |
| `authorBio` | optional | One sentence about the author |
| `language` | optional | `en` (default) or `ne` for an article written in Nepali |
| `related` | recommended | Source record ids of the papers the article discusses, comma-separated, e.g. `SRC-013, SRC-002`. They appear as links under the article, and the article appears on those papers' record pages. Find an id on the paper's record page (e.g. "SRC-013 · Complete metadata"). |
| `tags` | optional | Comma-separated, e.g. `Kamaiya, Land & livelihoods` |

## Writing the text

Standard Markdown works: `## Heading`, `**bold**`, `*italic*`, `- bullet lists`,
`1. numbered lists`, `> quotes` and `[link text](https://example.org)`.
To link to a paper in this archive, use `[the ILO study](/source/SRC-002)`.
Cite sources in the text as described in the volunteers' Citation Guide (Chicago author-date, with links).

Raw HTML is removed when the article is shown, so paste plain text, not formatted HTML.
Files starting with `_` and this README are never published.
