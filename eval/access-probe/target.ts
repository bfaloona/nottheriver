/** The URL to probe from the query string, or null unless it is an absolute http(s) URL. */
export function parseTarget(raw: string | null): URL | null {
  try {
    const url = new URL(raw ?? '');
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}
