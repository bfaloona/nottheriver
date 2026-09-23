import type { ComponentName } from '../src/contract';

// The site displays these next to every result set; they must sum to 1 so a score stays in [0, 1].
export const WEIGHTS: Readonly<Record<ComponentName, number>> = Object.freeze({
  relevance: 0.25,
  ethics: 0.3,
  env: 0.3,
  proximity: 0.15,
});
