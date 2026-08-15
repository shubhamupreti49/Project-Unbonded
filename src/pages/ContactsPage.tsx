import { Layout } from '../main.jsx';
import { contacts } from '../../data/contacts.js';

const team = [
  { name: 'Shubham Upreti', url: 'https://shubhamupreti.com.np' },
  { name: 'Aaspad Lamichhane' },
  { name: 'Melish Prasai' },
  { name: 'Shushant Upreti' },
  { name: 'Kritika Luitel' },
  { name: 'Nirjhara Shrestha' },
];

export default function ContactsPage() {
  return <Layout active="contacts">
    <section className="contacts-hero">
      <div className="shell">
        <h1>Organisation contacts</h1>
        <p>Public contact details for organisations represented in this repository. Contact an organisation directly for clarification about its work or publications.</p>
      </div>
    </section>

    <section className="section contacts-directory">
      <div className="shell contacts-intro"><p>These details are drawn from public organisation contact pages and the project’s working contact list. They are provided for research follow-up, not as endorsement or as a substitute for checking the original publication.</p></div>
      <div className="shell contacts-grid">
        {contacts.map((contact) => <article className="contact-card" key={contact.name}>
          <h2>{contact.name}</h2>
          <p>{contact.focus}</p>
          <dl>
            {contact.website && <div><dt>Website</dt><dd><a href={contact.website} target="_blank" rel="noreferrer">Visit website ↗</a></dd></div>}
            {contact.email && <div><dt>Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>}
            {contact.phone && <div><dt>Phone</dt><dd><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a></dd></div>}
            {contact.contactUrl && <div><dt>Contact page</dt><dd><a href={contact.contactUrl} target="_blank" rel="noreferrer">Open public contact details ↗</a></dd></div>}
          </dl>
        </article>)}
      </div>
    </section>

    <section className="about-team" aria-labelledby="about-team-title">
      <div className="shell about-team-inner">
        <div>
          <h2 id="about-team-title">About Team Unbonded</h2>
          <p>This repository was built by Team Unbonded at the Uunchai Summer Mentorship Program, a Nepal-rooted initiative creating pathways for talented students to engage with real-world opportunities.</p>
        </div>
        <ul aria-label="Team Unbonded contributors">
          {team.map((member) => <li key={member.name}>{member.url ? <a className="team-link" href={member.url} target="_blank" rel="noreferrer">{member.name}</a> : member.name}</li>)}
        </ul>
      </div>
    </section>
  </Layout>;
}
