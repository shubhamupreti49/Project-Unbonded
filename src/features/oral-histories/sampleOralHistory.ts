import type { OralHistory } from './types';

/**
 * PLACEHOLDER RECORD — demonstrates the data shape only.
 * It contains no real testimony. Replace it with a verified, consented interview and its
 * reviewed transcript before publishing; do not ship placeholder text as a real narrator.
 *
 * Transcripts for long interviews should live in their own JSON file (e.g.
 * public/media/oral-histories/uah-0001.transcript.json) and be fetched when the player
 * opens, so the page listing many interviews stays light.
 */
export const SAMPLE_ORAL_HISTORY: OralHistory = {
  id: 'UA-OH-0001',
  title: {
    en: 'Sample interview (placeholder)',
    ne: 'नमुना अन्तर्वार्ता (प्रतिस्थापन गर्नुपर्ने)',
  },
  narrator: {
    displayName: { en: 'Narrator name', ne: 'कथावाचकको नाम' },
    pseudonym: true,
  },
  community: 'kamaiya',
  region: 'lumbini',
  recordedOn: '2026-01-15',
  durationSeconds: 60,
  audio: {
    sources: [
      { src: 'media/oral-histories/UA-OH-0001-24k.opus', type: 'audio/ogg; codecs=opus' },
      { src: 'media/oral-histories/UA-OH-0001-48k.m4a', type: 'audio/mp4; codecs=mp4a.40.2' },
    ],
    download: { src: 'media/oral-histories/UA-OH-0001-48k.m4a' },
  },
  consent: 'public-online',
  transcript: [
    {
      id: 's1',
      start: 0,
      end: 12,
      speaker: { en: 'Interviewer', ne: 'अन्तर्वार्ताकार' },
      text: {
        ne: '[नमुना खण्ड १ — प्रमाणित नेपाली ट्रान्सक्रिप्टले प्रतिस्थापन गर्नुहोस्।]',
        en: '[Sample segment 1 — replace with the verified English translation.]',
      },
    },
    {
      id: 's2',
      start: 12,
      end: 31,
      speaker: { en: 'Narrator', ne: 'कथावाचक' },
      text: {
        ne: '[नमुना खण्ड २ — कथावाचकका शब्द जस्ताको तस्तै राख्नुहोस्।]',
        en: '[Sample segment 2 — keep the narrator’s words as spoken.]',
      },
    },
    {
      id: 's3',
      start: 31,
      end: 60,
      speaker: { en: 'Narrator', ne: 'कथावाचक' },
      // English intentionally omitted to show the "translation pending" state.
      text: {
        ne: '[नमुना खण्ड ३ — अनुवाद बाँकी रहेको अवस्था देखाउन अङ्ग्रेजी हटाइएको।]',
      },
    },
  ],
};
