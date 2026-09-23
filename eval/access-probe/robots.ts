// Robots Exclusion Protocol, RFC 9309: https://www.rfc-editor.org/rfc/rfc9309.html

interface Rule { allow: boolean; pattern: string }
interface Group { agents: string[]; rules: Rule[] }

function parse(text: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === 'user-agent') {
      // Consecutive user-agent lines share one group; a user-agent line after rules starts a new one.
      if (!current || current.rules.length > 0) groups.push((current = { agents: [], rules: [] }));
      current.agents.push(value.toLowerCase());
    } else if ((key === 'allow' || key === 'disallow') && current && value) {
      current.rules.push({ allow: key === 'allow', pattern: value });
    }
  }
  return groups;
}

function matches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith('$');
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp('^' + body + (anchored ? '$' : '')).test(path);
}

/** `path` is the URL's pathname plus search. `token` is the crawler's product token, matched case-insensitively. */
export function isAllowed(robotsTxt: string, token: string, path: string): boolean {
  if (path === '/robots.txt') return true;
  const groups = parse(robotsTxt);
  const own = groups.filter((g) => g.agents.includes(token.toLowerCase()));
  const rules = (own.length > 0 ? own : groups.filter((g) => g.agents.includes('*'))).flatMap((g) => g.rules);
  let best: Rule | null = null;
  for (const rule of rules) {
    if (!matches(rule.pattern, path)) continue;
    // Longest pattern wins; on a tie the RFC says allow SHOULD win.
    if (!best || rule.pattern.length > best.pattern.length || (rule.pattern.length === best.pattern.length && rule.allow)) {
      best = rule;
    }
  }
  return best ? best.allow : true;
}
