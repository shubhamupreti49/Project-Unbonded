import { useTranslation } from 'react-i18next';
import { Layout } from '../main.jsx';
import { contacts } from '../../data/contacts.js';
import { OriginalLanguageNotice } from '../components/OriginalLanguageNotice';

const team = [
  { name: 'Shubham Upreti', url: 'https://shubhamupreti.com.np' },
  { name: 'Aaspad Lamichhane' },
  { name: 'Melish Prasai' },
  { name: 'Shushant Upreti' },
  { name: 'Kritika Luitel' },
  { name: 'Nirjhara Shrestha' },
];

export default function ContactsPage() {
  const { t } = useTranslation('contacts');

  return <Layout active="contacts">
    <section className="contacts-hero">
      <div className="shell">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.lead')}</p>
      </div>
    </section>

    <section className="section contacts-directory">
      <div className="shell contacts-intro"><p>{t('intro')}</p><OriginalLanguageNotice /></div>
      <div className="shell contacts-grid">
        {/* Organisation names and focus descriptions are kept as the organisations publish them. */}
        {contacts.map((contact) => <article className="contact-card" key={contact.name}>
          <h2 lang="en">{contact.name}</h2>
          <p lang="en">{contact.focus}</p>
          <dl>
            {contact.website && <div><dt>{t('labels.website')}</dt><dd><a href={contact.website} target="_blank" rel="noreferrer">{t('labels.visitWebsite')} ↗</a></dd></div>}
            {contact.email && <div><dt>{t('labels.email')}</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>}
            {contact.phone && <div><dt>{t('labels.phone')}</dt><dd><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a></dd></div>}
            {contact.contactUrl && <div><dt>{t('labels.contactPage')}</dt><dd><a href={contact.contactUrl} target="_blank" rel="noreferrer">{t('labels.openContact')} ↗</a></dd></div>}
          </dl>
        </article>)}
      </div>
    </section>

    <section className="about-team" aria-labelledby="about-team-title">
      <div className="shell about-team-inner">
        <div>
          <h2 id="about-team-title">{t('team.heading')}</h2>
          <p>{t('team.text')}</p>
        </div>
        <ul aria-label={t('team.listLabel')}>
          {team.map((member) => <li key={member.name} lang="en">{member.url ? <a className="team-link" href={member.url} target="_blank" rel="noreferrer">{member.name}</a> : member.name}</li>)}
        </ul>
      </div>
    </section>
  </Layout>;
}
