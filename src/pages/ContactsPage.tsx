import { useTranslation } from 'react-i18next';
import { Layout } from '../main.jsx';
import { contacts } from '../../data/contacts.js';
import { OriginalLanguageNotice } from '../components/OriginalLanguageNotice';

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

  </Layout>;
}
