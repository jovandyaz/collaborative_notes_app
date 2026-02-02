import { HTML_ENTITIES } from './constants';

function decodeHtmlEntities(text: string): string {
  let decoded = text;

  Object.entries(HTML_ENTITIES).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  });

  decoded = decoded.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );

  return decoded;
}

export function stripHtmlTags(html: string): string {
  if (!html) {
    return '';
  }

  const withoutTags = html.replace(/<[^>]*>/g, ' ');

  const decoded = decodeHtmlEntities(withoutTags);

  return decoded;
}

export function normalizeWhitespace(text: string): string {
  if (!text) {
    return '';
  }
  return text.replace(/\s+/g, ' ').trim();
}

function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  let truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > maxLength * 0.8) {
    truncated = truncated.slice(0, lastSpaceIndex);
  }

  return truncated + '...';
}

export function createPreview(html: string, maxLength = 150): string {
  if (!html) {
    return '';
  }

  const stripped = stripHtmlTags(html);
  const normalized = normalizeWhitespace(stripped);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return truncateAtWordBoundary(normalized, maxLength);
}
