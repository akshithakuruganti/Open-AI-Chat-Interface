// URL & intent helpers

export const VALID_TLD =
  /\.(com|org|net|io|co|in|edu|gov|dev|app|ai|me|tv|info|biz|uk|us|au|ca|de|fr|jp|br|ng|pk)(\.[a-z]{2})?/i;

/** Normalise a detected host/path to a full URL string */
export const toFullURL = (raw: string): string =>
  raw.startsWith("http") ? raw : `https://${raw}`;

/** Returns true if the user wants Claude to sing something */
export const isSingRequest = (text: string): boolean => /\bsing\b/i.test(text);

/**
 * Extract the raw host+path from an "open / visit / go to …" intent.
 * Returns null if no URL-like token is detected.
 */
export const extractURLFromIntent = (input: string): string | null => {
  const intentPattern =
    /(?:open|go\s+to|visit|navigate\s+to|take\s+me\s+to|launch|browse\s+to|i\s+want\s+to\s+open|redirect\s+to|show\s+me)\s+(?:the\s+)?(?:website\s+)?(?:https?:\/\/)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s]*)?)/i;
  const urlOnlyPattern =
    /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)$/i;

  const intentMatch = input.match(intentPattern);
  if (intentMatch && VALID_TLD.test(intentMatch[1])) return intentMatch[1];

  const urlMatch = input.match(urlOnlyPattern);
  if (urlMatch && VALID_TLD.test(urlMatch[1])) return urlMatch[1];

  return null;
};

/**
 * Extract the raw host+path from a "close / shut / exit …" intent.
 * Needs the current openedWindows map to resolve bare hostnames like "youtube".
 */
export const extractCloseURLFromIntent = (
  input: string,
  openedWindows: Map<string, Window>,
): string | null => {
  const closePattern =
    /(?:close|shut(?:\s+down)?|exit|dismiss|terminate|kill)\s+(?:the\s+)?(?:tab\s+(?:for\s+|of\s+)?|window\s+(?:for\s+|of\s+)?)?(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/i;

  const reversePattern =
    /(?:close|shut(?:\s+down)?|exit|dismiss|terminate|kill)\s+(?:the\s+)?(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+)(?:\s+tab|\s+window|\s+page)/i;

  const match = input.match(closePattern);
  if (match && VALID_TLD.test(match[1])) return match[1];

  const reverseMatch = input.match(reversePattern);
  if (reverseMatch) {
    const hostname = reverseMatch[1].toLowerCase();
    for (const key of openedWindows.keys()) {
      if (key.includes(hostname)) return new URL(key).hostname;
    }
  }

  return null;
};