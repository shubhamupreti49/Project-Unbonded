# Catalogue corrections log

Every change to the records in `data/sources.js` is listed here with the value before and after and the reason. Findings, years, titles and coding are not changed without a reason recorded below. Where a value could not be checked against the original source, it was left as entered and listed under "Open questions".

## 2026-10-03: data-quality pass

Prepared with Claude (AI assistant) at the request of Shubham Upreti, for review before publishing. Wording of recorded findings was not changed except for spelling; findings typed as one block with "-" bullets were split into separate findings with the wording intact.

Summary:

- Citations moved out of the note field: 8 records.
- Findings split into separate items: 11 records.
- Placeholder "No claim recorded" replaced with an empty findings list: 5 records.
- Broken links inside citations repaired: 6 records. Tracking suffix "?u" removed from 2 URLs (both checked, HTTP 200).
- SRC-035 retired as a duplicate of SRC-001 (same DOI). It is kept under `retired` in the data file and its address redirects to SRC-001.
- Contributor names trimmed of trailing spaces and repeats: 19 records (not itemised below).

### Changes by record

#### event 2022

| Field | Before | After | Reason |
|---|---|---|---|
| sourceHint | “The Harawa-Charawa?s liberation” | “The Harawa-Charawa’s liberation” | Broken apostrophe (encoding error). |

#### SRC-001

| Field | Before | After | Reason |
|---|---|---|---|
| methodology | “Cross-sectional survey &canthropometric measurement” | “Cross-sectional survey & anthropometric measurement” | Typing error. |
| sampleSize | “280 mother– child pairs” | “280 mother–child pairs” | Stray space. |
| population | “Former-Kamaiya children (under 5 ) and mothers” | “Former-Kamaiya children (under 5) and mothers” | Stray space. |
| citation | “Khatri, R. B., Mishra, S. R., Khanal, V., & Choulagai, B. (2015). Factors associated with underweight among children of former- Kamaiyas in Nepal. Frontiers in Public Health, 3, Article 11. https://doi.org/10.3389/fpubh.2015.00011” | “Khatri, R. B., Mishra, S. R., Khanal, V., & Choulagai, B. (2015). Factors associated with underweight among children of former-Kamaiyas in Nepal. Frontiers in Public Health, 3, Article 11. https://doi.org/10.3389/fpubh.2015.00011” | Stray space copied from a line break. |

#### SRC-003

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “-The Report survey indicates that most of the kamaiya households have better financial security due to the utilization of productive lands, cash, and loans they received for investment purposes to generate diversified livelihoods.” | “The Report survey indicates that most of the kamaiya households have better financial security due to the utilization of productive lands, cash, and loans they received for investment purposes to generate diversified livelihoods.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |
| gap | “-Saptari has witnessed a significant decline in bonded labour from approximately 38.4% of households in 2017 to 21.3% in 2022.” | “Saptari has witnessed a significant decline in bonded labour from approximately 38.4% of households in 2017 to 21.3% in 2022.” | Removed a stray leading hyphen. |
| citation | “Freedom Fund(2024). From liberation to livelihood. https://www.freedomfund.org/news/from-liberation-to-livelihood/” | “Freedom Fund. (2024). From liberation to livelihood. https://www.freedomfund.org/news/from-liberation-to-livelihood/” | Added the missing full stop and space between author and year. |
| population | “Haliya/ Kamaiya / Haruwa- Charuwa” | “Haliya / Kamaiya / Haruwa-Charuwa” | Inconsistent spacing in system names. |
| geography | “Districts of Bardiya, Kanchanpur and Saptari.” | “Districts of Bardiya, Kanchanpur and Saptari” | Removed a stray full stop. |

#### SRC-004

| Field | Before | After | Reason |
|---|---|---|---|
| geography | “Eastern Terai; Dhanusha District; Dhanauji Rural Municipality; Ganeshman- Charnath Municipality; Shahidnagar Municipality” | “Eastern Terai; Dhanusha District; Dhanauji Rural Municipality; Ganeshman-Charnath Municipality; Shahidnagar Municipality” | Stray space. |
| systems | “Cross-system / general” | “Haruwa-Charuwa” | The study is specifically about Harawa-Charawa households in Dhanusha (see title); it was coded as "Cross-system / general", which hid it from the Haruwa-Charuwa filter. |

#### SRC-005

| Field | Before | After | Reason |
|---|---|---|---|
| sampleSize | “Not Specified” | “Not specified” | Consistent capitalisation of "Not specified". |

#### SRC-006

| Field | Before | After | Reason |
|---|---|---|---|
| gap | “-No publication year/ sample size” | “No publication year/ sample size” | Removed a stray leading hyphen. |
| citation | “Anti-Slavery International. (n.d.). Nepal: Tackling bonded labour. https://www.antislavery.org/what-we-do/nepal-bonded- labour/” | “Anti-Slavery International. (n.d.). Nepal: Tackling bonded labour. https://www.antislavery.org/what-we-do/nepal-bonded-labour/” | URL inside the citation contained spaces (line breaks copied from a PDF) and did not work as a link; replaced with the record's verified URL. |
| sampleSize | “-” | “Not reported” | A bare "-" was used for a missing value; replaced with the standard "Not reported". |

#### SRC-007

| Field | Before | After | Reason |
|---|---|---|---|
| gap | “-No sample size” | “No sample size” | Removed a stray leading hyphen. |
| citation | “Anti-Slavery International(2008). Freedom for 20,000 people as Nepal abolishes bonded labour practice. https://www.antislavery.org/latest/freedom-20000-people-nepal -abolishes-bonded-labour-practice/” | “Anti-Slavery International. (2008). Freedom for 20,000 people as Nepal abolishes bonded labour practice. https://www.antislavery.org/latest/freedom-20000-people-nepal-abolishes-bonded-labour-practice/” | URL inside the citation contained spaces (line breaks copied from a PDF) and did not work as a link; replaced with the record's verified URL. Added the missing full stop and space between author and year. |
| sampleSize | “-” | “Not reported” | A bare "-" was used for a missing value; replaced with the standard "Not reported". |

#### SRC-008

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “-Oral and written contracts called "Laguwa" between Haruwa- Charuwa and their employers often favour the landlords' agreements and their ways of exploitation. More than 45% of Haruwa-Chaurwa do not even have contracts, giving their landlords the opportunity to impose their own employment terms, wages, and working conditions.” | “Oral and written contracts called "Laguwa" between Haruwa-Charuwa and their employers often favour the landlords' agreements and their ways of exploitation. More than 45% of Haruwa-Charuwa do not even have contracts, giving their landlords the opportunity to impose their own employment terms, wages, and working conditions.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. Spelling of the system name. Stray space in the system name. |
| url | “https://www.ilo.org/resource/article/fighting-bonded-labour-nepal?u” | “https://www.ilo.org/resource/article/fighting-bonded-labour-nepal” | Removed a stray "?u" query suffix; the clean URL was checked and returns HTTP 200. |
| citation | “International Labour Organization(2013) Fighting bonded labour in Nepal. https://www.ilo.org/resource/article/fighting-bonded- labour-nepal?u” | “International Labour Organization. (2013). Fighting bonded labour in Nepal. https://www.ilo.org/resource/article/fighting-bonded-labour-nepal” | URL inside the citation contained spaces (line breaks copied from a PDF) and did not work as a link; replaced with the record's verified URL. Added the missing full stop and space between author and year. |
| population | “Haruwa- charuwa” | “Haruwa-Charuwa” | Spelling and capitalisation of the system name. |
| author | “ILO” | “International Labour Organization (ILO)” | Consistent organisation name across records. |
| sampleSize | “-” | “Not reported” | A bare "-" was used for a missing value; replaced with the standard "Not reported". |

#### SRC-009

| Field | Before | After | Reason |
|---|---|---|---|
| gap | “-Government of Nepal officially abolished the Kamlari system in 2013.” | “Government of Nepal officially abolished the Kamlari system in 2013.” | Removed a stray leading hyphen. |
| citation | “Nepal Youth Foundation(2014). The History of Kamlari in Nepal. https://nepalyouthfoundation.org/wp-content/uploads/2014/05/N YF-FactSheet-History_of_Kamlari-May2014.pdf” | “Nepal Youth Foundation. (2014). The History of Kamlari in Nepal. https://nepalyouthfoundation.org/wp-content/uploads/2014/05/NYF-FactSheet-History_of_Kamlari-May2014.pdf” | URL inside the citation contained spaces (line breaks copied from a PDF) and did not work as a link; replaced with the record's verified URL. Added the missing full stop and space between author and year. |

#### SRC-010

| Field | Before | After | Reason |
|---|---|---|---|
| citation | “Community Self-reliance Center(2019). Harwa Charwa: The community waiting for Freedom.https://csrcnepal.org/wp-co ntent/uploads/2019/08/HarwaCharwa_brochure_Eng.pdf” | “Community Self-Reliance Centre. (2019). Harwa Charwa: The community waiting for Freedom. https://csrcnepal.org/wp-content/uploads/2019/08/HarwaCharwa_brochure_Eng.pdf” | URL inside the citation contained spaces (line breaks copied from a PDF) and did not work as a link; replaced with the record's verified URL. Added the missing full stop and space between author and year. Organisation name as the organisation spells it (matches SRC-004). |
| claims | “The Brochure recommends goverment to take pertinent steps for liberating Haruwa-Charuwa through adequate data collection of their situations as per the constitutional arrangement to plan out effective rehabilitation packages.” | “The Brochure recommends government to take pertinent steps for liberating Haruwa-Charuwa through adequate data collection of their situations as per the constitutional arrangement to plan out effective rehabilitation packages.” | Spelling. |
| population | “Haruwa- charuwa” | “Haruwa-Charuwa” | Spelling and capitalisation of the system name. |
| author | “Community self- reliance center” | “Community Self-Reliance Centre (CSRC)” | Consistent organisation name across records (matches SRC-004). |
| sampleSize | “-” | “Not reported” | A bare "-" was used for a missing value; replaced with the standard "Not reported". |

#### SRC-011

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “-Lack of formation of trade unions and awareness of the current minimum wage rates & labour rights have made children more vulnerable to forced labour in brick kilns, internal and cross-border migrations.” | “Lack of formation of trade unions and awareness of the current minimum wage rates & labour rights have made children more vulnerable to forced labour in brick kilns, internal and cross-border migrations.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |
| gap | “-Children account for approximately 10% (17,738) of total workers” | “Children account for approximately 10% (17,738) of total workers” | Removed a stray leading hyphen. |
| url | “https://www.unicef.org/nepal/press-releases/ending-forced-and-child-labour-nepals-brick-industry-need-holistic-approach?u” | “https://www.unicef.org/nepal/press-releases/ending-forced-and-child-labour-nepals-brick-industry-need-holistic-approach” | Removed a stray "?u" query suffix; the clean URL was checked and returns HTTP 200. |
| citation | “UNICEF(2021). Ending forced and child labour in Nepal’s brick industry. https://www.unicef.org/nepal/press-releases/ending- forced-and-child-labour-nepals-brick-industry-need-holistic- approach?u” | “UNICEF. (2021). Ending forced and child labour in Nepal’s brick industry. https://www.unicef.org/nepal/press-releases/ending-forced-and-child-labour-nepals-brick-industry-need-holistic-approach” | URL inside the citation contained spaces (line breaks copied from a PDF) and did not work as a link; replaced with the record's verified URL. Added the missing full stop and space between author and year. |
| author | “Unicef” | “UNICEF” | Organisation name capitalisation. |
| sampleSize | “-” | “Not reported” | A bare "-" was used for a missing value; replaced with the standard "Not reported". |

#### SRC-012

| Field | Before | After | Reason |
|---|---|---|---|
| gap | “- Interview with Haruwa- Charuwa Rights Forum Committee” | “Interview with Haruwa-Charuwa Rights Forum Committee” | Removed a stray leading hyphen. Stray space in the system name. |
| citation | “Freedom Fund(2023). The Harawa-Charawa's liberation. https://www.freedomfund.org/hotspot/nepal/” | “Freedom Fund. (2023). The Harawa-Charawa's liberation. https://www.freedomfund.org/hotspot/nepal/” | Added the missing full stop and space between author and year. |
| population | “Harawa/ Charawa” | “Harawa-Charawa” | Spacing in the system name (source spelling kept). |
| sampleSize | “2-3 (former Haruwa-charuwa victims)” | “2–3 (former Haruwa-Charuwa workers)” | House style: describe people by their situation, not as "victims" (Research Intern Handbook, section 8). |

#### SRC-013

| Field | Before | After | Reason |
|---|---|---|---|
| gap | “-By the end of February 2016, thousands of ex-Kamaiya families had received land or rehabilitation support.” | “By the end of February 2016, thousands of ex-Kamaiya families had received land or rehabilitation support.” | Removed a stray leading hyphen. |
| citation | “Tharu Cultural Mueseum(2026). The Kamaiya Movement. https://tharuculturalmuseum.org/the-kamaiya-movement/” | “Tharu Cultural Museum. (2026). The Kamaiya Movement. https://tharuculturalmuseum.org/the-kamaiya-movement/” | Added the missing full stop and space between author and year. Spelling. |
| claims | “The report claims that forest clearing, land expansion, malaria eradication, and migration from hill regions led Kamaiya households lose their traditional land and ownership because of no land registration documents & limited awareness of goverment procedures.” | “The report claims that forest clearing, land expansion, malaria eradication, and migration from hill regions led Kamaiya households lose their traditional land and ownership because of no land registration documents & limited awareness of government procedures.” | Spelling. |
| geography | “Nepal’s western region(Dang, Banke , Bardiya, Kailali, and Kanchanpur.)” | “Nepal’s western region (Dang, Banke, Bardiya, Kailali, and Kanchanpur)” | Spacing and punctuation. |
| author | “Tharu cultural museum” | “Tharu Cultural Museum” | Organisation name capitalisation. |
| sampleSize | “-” | “Not reported” | A bare "-" was used for a missing value; replaced with the standard "Not reported". |

#### SRC-014

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “No claim recorded” | (none) | Placeholder text "No claim recorded" was displayed as if it were a finding; replaced with an empty list so the page shows "Findings not yet recorded". |

#### SRC-015

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “No claim recorded” | (none) | Placeholder text "No claim recorded" was displayed as if it were a finding; replaced with an empty list so the page shows "Findings not yet recorded". |

#### SRC-016

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “No claim recorded” | (none) | Placeholder text "No claim recorded" was displayed as if it were a finding; replaced with an empty list so the page shows "Findings not yet recorded". |

#### SRC-017

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “No claim recorded” | (none) | Placeholder text "No claim recorded" was displayed as if it were a finding; replaced with an empty list so the page shows "Findings not yet recorded". |

#### SRC-018

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “No claim recorded” | (none) | Placeholder text "No claim recorded" was displayed as if it were a finding; replaced with an empty list so the page shows "Findings not yet recorded". |

#### SRC-019

| Field | Before | After | Reason |
|---|---|---|---|
| sampleSize | “-” | “Not reported” | A bare "-" was used for a missing value; replaced with the standard "Not reported". |

#### SRC-023

| Field | Before | After | Reason |
|---|---|---|---|
| geography | “Ex-Kamaiya, Kamlaris” | “17 districts of the Mid and Far West regions of Nepal” | Geography, population and sample size had been entered one field out of place. |
| population | “Kamaiya” | “Ex-Kamaiya and Kamlari” | Geography, population and sample size had been entered one field out of place. |
| sampleSize | “17 districts of the Mid and Far West regions of Nepal” | “Not reported” | Geography, population and sample size had been entered one field out of place. |

#### SRC-029

| Field | Before | After | Reason |
|---|---|---|---|
| citation | (empty) | “Sharma, S., Basnyat, B., & Ganesh, G. C. (2001). Bonded labour among child workers of the Kamaiya system: A rapid assessment. International Labour Organization, International Programme on the Elimination of Child Labour. https://un.info.np/Net/NeoDocs/View/3564” | Citation had been entered in the repository-note field; moved to the citation field. |
| gap | “Sharma, S., Basnyat, B., & Ganesh, G. C. (2001). Bonded labour among child workers of the Kamaiya system: A rapid assessment. International Labour Organization, International Programme on the Elimination of Child Labour. https://un.info.np/Net/NeoDocs/View/3564” | (empty) | Repository-note field held the citation (now moved); no separate note was recorded. |
| claims | “- Wage child labour incidence among Kamaiya families was 30%, compared with the 4.4% rural Nepal average cited in the report. - Child labour was linked to landlessness, poverty/indebtedness, parental labour relationships, and land contracts.” | “Wage child labour incidence among Kamaiya families was 30%, compared with the 4.4% rural Nepal average cited in the report.” / “Child labour was linked to landlessness, poverty/indebtedness, parental labour relationships, and land contracts.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

#### SRC-030

| Field | Before | After | Reason |
|---|---|---|---|
| citation | (empty) | “World Organisation Against Torture. (2006). The Kamaiya system of bonded labour in Nepal. https://www.omct.org/files/interdisciplinary-study/ii_b_3_nepal_case_study.pdf” | Citation had been entered in the repository-note field; moved to the citation field. |
| gap | “World Organisation Against Torture. (2006). The Kamaiya system of bonded labour in Nepal. https://www.omct.org/files/interdisciplinary-study/ii_b_3_nepal_case_study.pdf” | (empty) | Repository-note field held the citation (now moved); no separate note was recorded. |
| claims | “- Legal abolition did not deliver substantive freedom because rehabilitation and alternative livelihoods remained unresolved. - The ban did not address structurally unequal agrarian relations, so gains could relapse.” | “Legal abolition did not deliver substantive freedom because rehabilitation and alternative livelihoods remained unresolved.” / “The ban did not address structurally unequal agrarian relations, so gains could relapse.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

#### SRC-031

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “- Generational family-based haliya/kamaiya agreements increasingly shifted work toward children. - Parents received in-kind income, loans, and adhiya land; promises of education helped parents and kisan continue child haliya/kamaiya contracts.” | “Generational family-based haliya/kamaiya agreements increasingly shifted work toward children.” / “Parents received in-kind income, loans, and adhiya land; promises of education helped parents and kisan continue child haliya/kamaiya contracts.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

#### SRC-032

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “- Children increasingly took on activities previously carried out by parents after the 2000 ban. - Participants defined their daily activities as bonded labour while also weighing the risks of leaving without education or vocational skills.” | “Children increasingly took on activities previously carried out by parents after the 2000 ban.” / “Participants defined their daily activities as bonded labour while also weighing the risks of leaving without education or vocational skills.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

#### SRC-033

| Field | Before | After | Reason |
|---|---|---|---|
| citation | (empty) | “Maycock, M. W. (2012). Masculinity, modernity and bonded labour: Continuity and change amongst the Kamaiya of Kailali district, far-west Nepal [Doctoral thesis, University of East Anglia]. UEA Digital Repository. https://ueaeprints.uea.ac.uk/id/eprint/43782/” | Citation had been entered in the repository-note field; moved to the citation field. |
| gap | “Maycock, M. W. (2012). Masculinity, modernity and bonded labour: Continuity and change amongst the Kamaiya of Kailali district, far-west Nepal [Doctoral thesis, University of East Anglia]. UEA Digital Repository. https://ueaeprints.uea.ac.uk/id/eprint/43782/” | (empty) | Repository-note field held the citation (now moved); no separate note was recorded. |

#### SRC-034

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “- Very small landholdings led many Mukta Kamaiya households into daily labour. - Wage labour was the occupation of 66.7% of respondents; Kamlahri child labour was still reported by 6% of households.” | “Very small landholdings led many Mukta Kamaiya households into daily labour.” / “Wage labour was the occupation of 66.7% of respondents; Kamlahri child labour was still reported by 6% of households.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

#### SRC-035

| Field | Before | After | Reason |
|---|---|---|---|
| citation | (empty) | “Khatri, R. B., Mishra, S. R., Khanal, V., & Choulagai, B. (2015). Factors associated with underweight among children of former-Kamaiyas in Nepal. Frontiers in Public Health, 3, Article 11. https://doi.org/10.3389/fpubh.2015.00011” | Citation had been entered in the repository-note field; moved to the citation field. |
| gap | “Khatri, R. B., Mishra, S. R., Khanal, V., & Choulagai, B. (2015). Factors associated with underweight among children of former-Kamaiyas in Nepal. Frontiers in Public Health, 3, Article 11. https://doi.org/10.3389/fpubh.2015.00011” | (empty) | Repository-note field held the citation (now moved); no separate note was recorded. |
| claims | “- Undernutrition among children of former-Kamaiya families was higher than the national average. - Female children were more likely to be underweight; daily bathing and mothers aged 24 or older were associated with lower odds.” | “Undernutrition among children of former-Kamaiya families was higher than the national average.” / “Female children were more likely to be underweight; daily bathing and mothers aged 24 or older were associated with lower odds.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |
| (record) | “active record” | “retired, redirects to SRC-001” | Duplicate of SRC-001: same paper, same DOI. |

#### SRC-036

| Field | Before | After | Reason |
|---|---|---|---|
| claims | “- Among 176,373 manual workers including family members, 6,229 were in forced labour and 1,035 were in bonded labour. - Among 34,593 children aged 5-17 living in brick kilns, 17,032 were identified as being in child labour.” | “Among 176,373 manual workers including family members, 6,229 were in forced labour and 1,035 were in bonded labour.” / “Among 34,593 children aged 5-17 living in brick kilns, 17,032 were identified as being in child labour.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

#### SRC-037

| Field | Before | After | Reason |
|---|---|---|---|
| citation | (empty) | “International Labour Organization. (2025). Analysis of situation of the freed-Haliyas in Karnali Province of Nepal. https://www.ilo.org/publications/analysis-situation-freed-haliyas-karnali-province-nepal-0” | Citation had been entered in the repository-note field; moved to the citation field. |
| gap | “International Labour Organization. (2025). Analysis of situation of the freed-Haliyas in Karnali Province of Nepal. https://www.ilo.org/publications/analysis-situation-freed-haliyas-karnali-province-nepal-0” | (empty) | Repository-note field held the citation (now moved); no separate note was recorded. |
| claims | “- Almost all ID-card-holding families received government rehabilitation support, but most did not receive the full package envisioned. - About 358 of 900 children (39.8%) fell under child labour, higher than the national average cited in the report.” | “Almost all ID-card-holding families received government rehabilitation support, but most did not receive the full package envisioned.” / “About 358 of 900 children (39.8%) fell under child labour, higher than the national average cited in the report.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

#### SRC-038

| Field | Before | After | Reason |
|---|---|---|---|
| citation | (empty) | “Government of Nepal. (2002). Bonded Labour (Prohibition) Act, 2058 (2002). https://daobanke.moha.gov.np/assets/23/bonded_labour_prohibition_act_2058_2002.pdf/file” | Citation had been entered in the repository-note field; moved to the citation field. |
| gap | “Government of Nepal. (2002). Bonded Labour (Prohibition) Act, 2058 (2002). https://daobanke.moha.gov.np/assets/23/bonded_labour_prohibition_act_2058_2002.pdf/file” | (empty) | Repository-note field held the citation (now moved); no separate note was recorded. |
| claims | “- Every person serving as a bonded labourer at commencement is freed. - Employment as a bonded labourer is prohibited, bonded debts are not payable, debt deeds/agreements are void, and rehabilitation/monitoring structures are established.” | “Every person serving as a bonded labourer at commencement is freed.” / “Employment as a bonded labourer is prohibited, bonded debts are not payable, debt deeds/agreements are void, and rehabilitation/monitoring structures are established.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |
| author | “Government of Nepal(Ministry of home affairs)” | “Government of Nepal” | The Act is issued by the Government of Nepal; the Ministry of Home Affairs only hosts the copy linked here. |

#### SRC-039

| Field | Before | After | Reason |
|---|---|---|---|
| citation | (empty) | “International Labour Organization, International Programme on the Elimination of Child Labour. (2009). Sustainable elimination of child bonded labour in Nepal - Phase II: External project review. https://webapps.ilo.org/ievaldiscovery/files/file/183150” | Citation had been entered in the repository-note field; moved to the citation field. |
| gap | “International Labour Organization, International Programme on the Elimination of Child Labour. (2009). Sustainable elimination of child bonded labour in Nepal - Phase II: External project review. https://webapps.ilo.org/ievaldiscovery/files/file/183150” | (empty) | Repository-note field held the citation (now moved); no separate note was recorded. |
| claims | “- Implementation was considerably delayed by political change/unrest, government approval, baseline timing, and competitive action-programme selection. - The review found an almost complete lack of indicators to assess progress toward objectives and recommended more regular field monitoring.” | “Implementation was considerably delayed by political change/unrest, government approval, baseline timing, and competitive action-programme selection.” / “The review found an almost complete lack of indicators to assess progress toward objectives and recommended more regular field monitoring.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

#### SRC-040

| Field | Before | After | Reason |
|---|---|---|---|
| citation | (empty) | “Committee on the Rights of the Child. (2005). Concluding observations: Nepal (CRC/C/15/Add.261). Office of the United Nations High Commissioner for Human Rights. https://docstore.ohchr.org/SelfServices/FilesHandler.ashx?enc=n6SYWSKRT1G8NfG46B5IgWPIVRxsh9kdcwmChcXPiYMwrFUbi7akqGzNpp%2BBVTgMQ9ZG%2BAJTbsHvLsLCNWH3Zg%3D%3D” | Citation had been entered in the repository-note field; moved to the citation field. |
| gap | “Committee on the Rights of the Child. (2005). Concluding observations: Nepal (CRC/C/15/Add.261). Office of the United Nations High Commissioner for Human Rights. https://docstore.ohchr.org/SelfServices/FilesHandler.ashx?enc=n6SYWSKRT1G8NfG46B5IgWPIVRxsh9kdcwmChcXPiYMwrFUbi7akqGzNpp%2BBVTgMQ9ZG%2BAJTbsHvLsLCNWH3Zg%3D%3D” | (empty) | Repository-note field held the citation (now moved); no separate note was recorded. |
| claims | “- The Committee was concerned that many Kamaiya children remained unreleased and continued to work as bonded labourers. - It also noted reports of many thousands of Dalit haliya bonded labourers, including children, working in agriculture in Western Nepal and the plains.” | “The Committee was concerned that many Kamaiya children remained unreleased and continued to work as bonded labourers.” / “It also noted reports of many thousands of Dalit haliya bonded labourers, including children, working in agriculture in Western Nepal and the plains.” | Findings were stored as one string with typed "-" bullets; split into separate findings so they display as a list. Wording unchanged. |

### Open questions (not changed; check against the original source)

- **SRC-013** (Tharu Cultural Museum, "The Kamaiya Movement") is dated 2026. A web page often shows the date it was viewed rather than published. Check the page for a publication date; if there is none, record it as n.d. This also changes the homepage year range, which is calculated from the data.
- **SRC-037** (ILO, freed-Haliyas in Karnali). The ILO lists this report on two pages, dated 26 May 2023 and 17 June 2025. The catalogue uses 2025 and the 2025 page, which matches news coverage of the report's release in June 2025. Keep 2025 unless the PDF's imprint says otherwise.
- **SRC-022** records that the Kamaiya system "was abolished in 2002". The government declaration was in 2000 and the Act in 2002. Check the ILO article's wording; if it says 2002, attribute the date to the article.
- **SRC-001** is coded with the theme "Legal abolition & policy", but it is a child-nutrition study. Confirm the coding.
- **SRC-003, SRC-009, SRC-011, SRC-013**: the repository note holds a finding or background fact rather than a limitation. Decide whether these belong under findings.
- **SRC-006, SRC-019, SRC-021, SRC-026** have no publication year. Check the pages, or their Wayback Machine snapshots, for a date.
- **SRC-014 to SRC-018** have no findings, method or geography recorded.
- **SRC-016 and SRC-017**: SRC-017 is the edited book that contains SRC-016 (Giri's chapter). Decide whether the book needs its own record.
- Twelve records have the method "Unspecified".
- Citations are in APA style and vary in completeness (for example, SRC-017 has no publisher and SRC-018 no conference name). The volunteer blog guide uses Chicago author-date. Converting the catalogue's citations should be done record by record against each source, not mechanically.
- **Timeline**: the event "Haruwa-Charuwa liberation" is dated 2022, but its supporting record (SRC-012) is a 2023 web page. Confirm the date of the government's declaration.
