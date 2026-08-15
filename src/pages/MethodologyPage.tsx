import { Layout } from '../main.jsx';

const guidance = [
  ['Find exactly what you need', 'Head over to the Source Catalogue to filter records fast. You can narrow your search by labour system, region, time period, or document type, including government files, research papers, and datasets.'],
  ['See the bigger picture', 'Use Timeline or Geography in the top menu to view visual maps and timelines. This helps you trace how laws evolved and see where different labour systems have been documented across Nepal over time.'],
  ['Check the background details', 'Open any record to look at it in detail. You will find context such as how a survey was conducted, sample sizes, and local boundaries. Read the complete story before drawing conclusions.'],
  ['Follow original material', 'Use the original PDFs and official document links for deeper reading. When using material in your own research or writing, credit the original author or government agency.'],
];

const limitations = [
  ['Language limitations', 'Searches were conducted in English, so Nepali-language sources may be absent.'],
  ['Curated collection', 'This is a curated repository from our team’s work, not an exhaustive systematic review.'],
  ['Paywalled material', 'Studies behind paid journal subscriptions may be absent, meaning some existing information is not represented here.'],
  ['No combined averages', 'Studies use different definitions and timelines, so this repository does not merge figures into combined averages.'],
  ['Limited sources', 'Maps show where research exists in this archive, not the prevalence of bonded labour. Not every document on bonded labour could be covered within this repository’s scope.'],
];

export default function MethodologyPage() {
  return <Layout active="methodology">
    <section className="page-hero methodology-hero">
      <div className="shell">
        <div className="methodology-hero-copy">
          <h1>How to use the repository</h1>
          <p>Use the hub to find evidence, understand its scope, and follow the original material.</p>
        </div>
        <div className="methodology-hero-counts" aria-label="Page overview">
          <div><strong>4</strong><span>ways to navigate</span></div>
          <div><strong>5</strong><span>limits to keep visible</span></div>
        </div>
      </div>
    </section>

    <section className="methodology-guide" aria-labelledby="guidance-title">
      <div className="shell">
        <div className="methodology-intro">
          <h2 id="guidance-title">Work from question to source.</h2>
          <p>Each route is designed to keep the record, its context, and its limits connected.</p>
        </div>
        <div className="methodology-steps">
          {guidance.map(([title, text], index) => <article key={title} data-step={`0${index + 1}`}>
            <span className="methodology-step-number" aria-hidden="true">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="methodology-limitations" aria-labelledby="limitations-title">
      <div className="shell">
        <div className="methodology-intro">
          <h2 id="limitations-title">Read the limits with the evidence.</h2>
          <p>These constraints shape what the repository can help users find and what it cannot establish.</p>
        </div>
        <div className="limitations-list">
          {limitations.map(([title, text], index) => <article key={title} data-limit={`0${index + 1}`}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>)}
        </div>
      </div>
    </section>
  </Layout>;
}
