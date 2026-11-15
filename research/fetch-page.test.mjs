import { describe, it, expect } from 'vitest';
import { parseRobots, robotsAllows, htmlToText, classify, slugOf } from './fetch-page.mjs';

const allows = (robots, path, agents) => robotsAllows(parseRobots(robots), path, agents);

describe('robotsAllows', () => {
  it('allows everything when there are no rules', () => {
    expect(allows('', '/anything')).toBe(true);
    expect(allows('User-agent: *\nDisallow:\n', '/anything')).toBe(true);
  });

  it('lets the longest matching rule win, and Allow win a tie', () => {
    const robots = 'User-agent: *\nDisallow: /ords/\nAllow: /ords/public/\n';
    expect(allows(robots, '/ords/imis/establishment.html')).toBe(false);
    expect(allows(robots, '/ords/public/list')).toBe(true);
    expect(allows('User-agent: *\nDisallow: /a\nAllow: /a\n', '/a')).toBe(true);
  });

  it('handles a site that opens only its home page', () => {
    const robots = 'User-agent: *\nAllow: /$\nDisallow: /\n';
    expect(allows(robots, '/')).toBe(true);
    expect(allows(robots, '/members')).toBe(false);
  });

  it('matches * inside a pattern', () => {
    const robots = 'User-agent: *\nDisallow: /*/search?\n';
    expect(allows(robots, '/en/search?q=x')).toBe(false);
    expect(allows(robots, '/en/searching')).toBe(true);
  });

  it('reads rules above any User-agent line as binding everyone', () => {
    const robots = '# no agent line\nDisallow: /resource/\nDisallow: /gen/\n';
    expect(allows(robots, '/resource/x')).toBe(false);
    expect(allows(robots, '/plans')).toBe(true);
  });

  it('applies one rule set to every agent named in a run of User-agent lines', () => {
    const robots = 'User-agent: GPTBot\nUser-agent: *\nDisallow: /private\n';
    expect(allows(robots, '/private')).toBe(false);
  });

  it('obeys a group written for Anthropic user-directed fetchers, not one for training crawlers', () => {
    const training = 'User-agent: *\nAllow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: GPTBot\nDisallow: /\n';
    expect(allows(training, '/directory')).toBe(true);
    for (const agent of ['Claude-User', 'Claude-Web', 'anthropic-ai']) {
      expect(allows(`User-agent: *\nAllow: /\n\nUser-agent: ${agent}\nDisallow: /\n`, '/directory')).toBe(false);
    }
  });

  it('keeps a crawl delay with its group', () => {
    const [group] = parseRobots('User-agent: *\nCrawl-delay: 5\nDisallow: /x\n');
    expect(group.crawlDelay).toBe(5);
    expect(group.rules).toEqual([{ allow: false, pattern: '/x' }]);
  });
});

describe('htmlToText', () => {
  it('drops scripts, keeps links as text [href], and splits table cells', () => {
    const html = '<p>See <a href="/data.xlsx">the file</a></p><script>var x = "<b>no</b>";</script><table><tr><td>A&amp;B</td><td>2</td></tr></table>';
    expect(htmlToText(html)).toBe('See the file [/data.xlsx]\n| A&B | 2');
  });
});

describe('classify', () => {
  const long = 'word '.repeat(400);

  it('names a page with enough text ok and a near-empty one a shell', () => {
    expect(classify(200, 'text/html; charset=utf-8', long)).toBe('ok');
    expect(classify(200, 'text/html', 'Loading')).toBe('shell');
  });

  it('names a bot check a challenge whether it comes as 403 or 200', () => {
    expect(classify(403, 'text/html', 'Just a moment...')).toBe('challenge');
    expect(classify(200, 'text/html', 'One moment, please... Please wait while your request is being verified')).toBe('challenge');
  });

  it('does not call a long article a challenge for quoting the words', () => {
    expect(classify(200, 'text/html', `${long.repeat(5)} access denied`)).toBe('ok');
  });

  it('names other refusals refused and non-HTML replies files', () => {
    expect(classify(404, 'text/html', 'Not found')).toBe('refused');
    expect(classify(200, 'application/pdf', '')).toBe('file');
  });
});

describe('slugOf', () => {
  it('keeps a short address whole', () => {
    expect(slugOf('https://www.epa.gov/greenchill/stores.xlsx')).toBe('www.epa.gov_greenchill_stores.xlsx');
  });

  it('gives two files in one deep folder different names that keep the host and the file name', () => {
    const folder = 'https://www.dol.gov/sites/dolgov/files/EBSA/employers-and-advisers/plan-administration-and-compliance/reporting-and-filing/form-5500';
    const a = slugOf(`${folder}/2025-instructions.pdf`);
    const b = slugOf(`${folder}/2024-instructions.pdf`);
    expect(a).not.toBe(b);
    expect(a.length).toBeLessThanOrEqual(90);
    expect(a.startsWith('www.dol.gov_')).toBe(true);
    expect(a.endsWith('2025-instructions.pdf')).toBe(true);
  });
});
