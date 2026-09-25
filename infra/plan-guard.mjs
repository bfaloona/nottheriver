// Decides whether infra/deploy.sh may apply a saved plan without the operator.
// Reads `tofu show -json <plan>` on stdin. Routine means one thing: a new Worker bundle.
// An update of the Worker script may change only the bundle attributes, plus attributes
// the provider recomputes (unknown until apply); bindings, limits, logging, dates or any
// other resource need the operator. Output names addresses and attributes, never values:
// the plan JSON holds the secret bindings in plain text.

const ROUTINE_TYPE = 'cloudflare_workers_script';
const BUNDLE_ATTRS = new Set(['content_file', 'content_sha256']);
const QUIET = new Set(['no-op', 'read']);

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Attributes of a routine update that changed beyond the bundle, or null if it cannot tell.
function extraChanges(change) {
  const { before, after, after_unknown: unknown = {} } = change;
  if (!before || !after) return null;
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((k) => !BUNDLE_ATTRS.has(k) && unknown[k] !== true && !same(before[k], after[k])).sort();
}

export function checkPlan(plan) {
  if (!Array.isArray(plan?.resource_changes)) {
    return { ok: false, changes: [], problems: ['plan has no resource_changes list'] };
  }
  const changes = [];
  const problems = [];
  for (const rc of plan.resource_changes) {
    const change = rc.change ?? {};
    const actions = change.actions ?? [];
    const line = `${actions.join('+') || 'no actions'} ${rc.address}`;
    if (actions.length === 0 || change.importing || rc.previous_address) {
      problems.push(`needs the operator: ${line} (${actions.length === 0 ? 'no actions' : change.importing ? 'import' : 'moved'})`);
      continue;
    }
    if (actions.every((a) => QUIET.has(a))) continue;
    changes.push(line);
    if (rc.type !== ROUTINE_TYPE || actions.length !== 1 || actions[0] !== 'update') {
      problems.push(`needs the operator: ${line}`);
      continue;
    }
    const extra = extraChanges(change);
    if (extra === null) problems.push(`needs the operator: ${line} (before or after not in the plan)`);
    else if (extra.length > 0) problems.push(`needs the operator: ${line} changes ${extra.join(', ')}`);
  }
  return { ok: problems.length === 0, changes, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  let plan;
  try {
    plan = JSON.parse(input);
  } catch {
    // A parse error message can quote the input, which holds key values.
    console.error('plan JSON could not be parsed');
    process.exit(1);
  }
  const result = checkPlan(plan);
  for (const line of result.changes) console.log(`  ${line}`);
  for (const line of result.problems) console.error(line);
  process.exit(result.ok ? 0 : 1);
}
