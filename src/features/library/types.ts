import type { LocalizedText } from '../../lib/localized';
import type { CommunityId, DocumentTypeId, RegionId } from './vocabulary';

/**
 * One archival document. Mirrors document.schema.json — update both together.
 */
export type ArchiveDocument = {
  /** Stable, never reused, e.g. "UA-DOC-0001". */
  id: string;
  title: LocalizedText;
  /** As printed on the document; for multiple authors use citation order. */
  author: string;
  /** null when the document is undated. */
  publicationYear: number | null;
  regions: RegionId[];
  /** Free-text precision the controlled regions can't hold, e.g. "Dhanusha District". */
  geographyNote?: string;
  communities: CommunityId[];
  documentType: DocumentTypeId;
  /** Language(s) the document itself is written in (BCP 47 codes). */
  languages: string[];
  summary?: LocalizedText;
  file?: DocumentFile;
  /** Publisher's page or DOI when the file isn't hosted by the archive. */
  externalUrl?: string;
  /** Links to the detailed record page at /source?id=… */
  sourceRecordId?: string;
};

export type DocumentFile = {
  url: string;
  format: 'pdf' | 'csv' | 'xlsx' | 'docx';
  /** Shown before download so readers on metered data can decide. */
  sizeBytes?: number;
  pageCount?: number;
  /** A compressed, text-first copy (see the PDF notes in DocumentCard.tsx). */
  lowBandwidthUrl?: string;
  lowBandwidthSizeBytes?: number;
};

export type ArchiveCollection = {
  $schema?: string;
  documents: ArchiveDocument[];
};
