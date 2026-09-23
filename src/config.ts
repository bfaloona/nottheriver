// The site name, mission, and every deploy-specific URL live here so a rename
// or a move to a custom domain touches one file.

export const siteName = 'nottheriver';

export const tagline =
  'Find who sells it near you or online, ranked by how they treat people and the planet, never Amazon.';

// Operator-entered, so a trailing slash must not turn /search into //search.
export const workerUrl: string = (import.meta.env.VITE_WORKER_URL ?? '').replace(/\/+$/, '');

export const repoUrl: string = import.meta.env.VITE_REPO_URL ?? '';

// Without a repo URL (dev, e2e) the About page explains the dispute process instead.
export function disputeUrlFor(repo: string): string {
  return repo ? `${repo}/issues/new?template=dispute-a-ranking.md` : 'about.html#dispute';
}

export const disputeUrl = disputeUrlFor(repoUrl);

export const zipsUrl = `${import.meta.env.BASE_URL}zips.json`;
