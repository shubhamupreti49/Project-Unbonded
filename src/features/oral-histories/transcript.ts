import type { TranscriptSegment } from './types';

/**
 * Index of the segment playing at `time`, or -1 between/outside segments.
 * Binary search: `timeupdate` fires ~4× per second and long interviews can have hundreds
 * of segments, so this stays cheap on low-end phones. Segments must be sorted by `start`.
 */
export function findActiveSegmentIndex(segments: TranscriptSegment[], time: number): number {
  let low = 0;
  let high = segments.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const segment = segments[middle];
    if (time < segment.start) high = middle - 1;
    else if (time >= segment.end) low = middle + 1;
    else return middle;
  }
  return -1;
}
