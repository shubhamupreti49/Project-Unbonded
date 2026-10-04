import { data } from '../../../data/sources.js';

/*
 * The homepage coverage figures, calculated from the catalogue so they can never drift
 * from it. District counts look for Nepal's 77 district names (and common spellings) in each
 * record's geography field, so a record naming "Dhanusa" or "Kavre" still counts.
 */
const DISTRICTS: Array<[name: string, ...variants: string[]]> = [
  ['Bhojpur'], ['Dhankuta'], ['Ilam'], ['Jhapa'], ['Khotang'], ['Morang'], ['Okhaldhunga'], ['Panchthar'], ['Sankhuwasabha'], ['Solukhumbu'], ['Sunsari'], ['Taplejung'], ['Terhathum', 'Tehrathum'], ['Udayapur', 'Udaypur'],
  ['Bara'], ['Dhanusha', 'Dhanusa'], ['Mahottari'], ['Parsa'], ['Rautahat'], ['Saptari'], ['Sarlahi'], ['Siraha'],
  ['Bhaktapur'], ['Chitwan', 'Chitawan'], ['Dhading'], ['Dolakha'], ['Kathmandu'], ['Kavrepalanchok', 'Kavre'], ['Lalitpur'], ['Makwanpur', 'Makawanpur'], ['Nuwakot'], ['Ramechhap'], ['Rasuwa'], ['Sindhuli'], ['Sindhupalchok', 'Sindhupalchowk'],
  ['Baglung'], ['Gorkha'], ['Kaski'], ['Lamjung'], ['Manang'], ['Mustang'], ['Myagdi'], ['Nawalpur'], ['Parbat'], ['Syangja'], ['Tanahun', 'Tanahu'],
  ['Arghakhanchi'], ['Banke'], ['Bardiya'], ['Dang'], ['Rukum East', 'Eastern Rukum'], ['Gulmi'], ['Kapilvastu', 'Kapilbastu'], ['Parasi'], ['Palpa'], ['Pyuthan'], ['Rolpa'], ['Rupandehi'],
  ['Dailekh'], ['Dolpa'], ['Humla'], ['Jajarkot'], ['Jumla'], ['Kalikot'], ['Mugu'], ['Salyan'], ['Surkhet'], ['Rukum West', 'Western Rukum'],
  ['Achham'], ['Baitadi'], ['Bajhang'], ['Bajura'], ['Dadeldhura'], ['Darchula'], ['Doti'], ['Kailali'], ['Kanchanpur'],
];

const geography = data.sources.map((source) => source.geography ?? '').join(' | ');
const named = (spelling: string) => new RegExp(`\\b${spelling.replace(/ /g, '\\s+')}\\b`, 'i').test(geography);
const years = data.sources.map((source) => source.year).filter((year): year is number => typeof year === 'number');

export const COVERAGE = {
  records: data.sources.length,
  findings: data.sources.reduce((total, source) => total + (source.claims?.length ?? 0), 0),
  firstYear: Math.min(...years),
  lastYear: Math.max(...years),
  districts: DISTRICTS.filter((spellings) => spellings.some(named)).length,
};
