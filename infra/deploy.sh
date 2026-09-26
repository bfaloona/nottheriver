#!/bin/sh
# Deploys the committed Worker with OpenTofu, only when the committed build differs from the
# last deployed state (a Worker changed by hand in Cloudflare may not show as a difference).
# Usage: infra/deploy.sh             plan; apply if the only change is the Worker script
#        infra/deploy.sh --check     plan only; say whether a deploy is needed
#        infra/deploy.sh --operator  as above, but a plan the guard refuses is shown in full and
#                                    applied only after the operator types the commit hash
#                                    (needs a terminal, so an agent cannot answer it)
# When to run it: .claude/skills/deploy/SKILL.md.
#
# Secrets: infra/deploy.local.env (gitignored) names the key FILES. Values are read into
# this process's environment only (never argv, never printed); the saved plan and its JSON
# hold them in plain text, so both live in a private temp dir removed on exit; every tofu
# output is checked for the literal values before it is shown (a backstop: it misses a value
# that tofu escapes or prints in part). Never run this under `sh -x`; tracing is forced off.
set -eu
set +x

root="$(cd "$(dirname "$0")/.." && pwd)"
config="$root/infra/deploy.local.env"

die() { echo "deploy: $*" >&2; exit 1; }

# A mistyped flag must never fall through to a real deploy.
check_only=false
operator=false
case "$*" in
  "") ;;
  --check) check_only=true ;;
  --operator) operator=true ;;
  *) die "usage: infra/deploy.sh [--check | --operator]" ;;
esac
# Checked before anything runs: the confirmation below is the operator's, never piped input.
if [ "$operator" = true ] && ! { [ -t 0 ] && [ -t 1 ]; }; then
  die "--operator needs an interactive terminal"
fi

[ -f "$config" ] || die "no config at infra/deploy.local.env; copy infra/deploy.local.env.example and fill it in"
# shellcheck source=/dev/null
. "$config"
for name in CLOUDFLARE_API_TOKEN_FILE CLOUDFLARE_ACCOUNT_ID_FILE BRAVE_API_KEY_FILE OPENROUTER_API_KEY_FILE ALLOWED_ORIGIN SITE_URL WORKER_URL; do
  eval "value=\${$name:-}"
  [ -n "$value" ] || die "config is missing $name"
done
file=""
for name in CLOUDFLARE_API_TOKEN_FILE CLOUDFLARE_ACCOUNT_ID_FILE BRAVE_API_KEY_FILE OPENROUTER_API_KEY_FILE; do
  eval "file=\$$name"
  [ -r "$file" ] || die "cannot read the file named by $name"
done

cd "$root"

# Deploy only what is committed and pushed, so the live Worker always matches a public commit.
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] || die "not on main"
[ -z "$(git status --porcelain -- proxy data infra)" ] || die "uncommitted changes under proxy/, data/ or infra/"
[ "$(git rev-list --count origin/main..HEAD)" = "0" ] || die "HEAD is not pushed to origin/main"
commit="$(git rev-parse --short HEAD)"

npx vitest run proxy infra >/dev/null 2>&1 || die "proxy tests fail; run: npx vitest run proxy infra"
npm run build:proxy >/dev/null 2>&1 || die "Worker build fails; run: npm run build:proxy"

tmp="$(mktemp -d)"
chmod 700 "$tmp"
trap 'rm -rf "$tmp"' EXIT
trap 'exit 130' INT TERM

# Inherited settings could log request bodies (secret bindings included) outside $tmp, or feed
# the plan values this script did not choose.
unset TF_LOG TF_LOG_PATH TF_LOG_CORE TF_LOG_PROVIDER
for name in $(env | sed -n 's/^\(TF_VAR_[A-Za-z0-9_]*\)=.*/\1/p'); do unset "$name"; done

CLOUDFLARE_API_TOKEN="$(cat "$CLOUDFLARE_API_TOKEN_FILE")"
TF_VAR_account_id="$(cat "$CLOUDFLARE_ACCOUNT_ID_FILE")"
TF_VAR_brave_api_key="$(cat "$BRAVE_API_KEY_FILE")"
TF_VAR_openrouter_api_key="$(cat "$OPENROUTER_API_KEY_FILE")"
TF_VAR_allowed_origin="$ALLOWED_ORIGIN"
TF_VAR_site_url="$SITE_URL"
export CLOUDFLARE_API_TOKEN TF_VAR_account_id TF_VAR_brave_api_key TF_VAR_openrouter_api_key TF_VAR_allowed_origin TF_VAR_site_url
# An empty value would be an empty grep pattern, which matches every line.
for value in "$CLOUDFLARE_API_TOKEN" "$TF_VAR_account_id" "$TF_VAR_brave_api_key" "$TF_VAR_openrouter_api_key"; do
  [ -n "$value" ] || die "a key file is empty"
done
printf '%s\n' "$CLOUDFLARE_API_TOKEN" "$TF_VAR_brave_api_key" "$TF_VAR_openrouter_api_key" >"$tmp/needles"

# Runs a command, holding its output until it is checked for key values. Sets $rc.
quiet() {
  rc=0
  "$@" >"$tmp/out" 2>&1 || rc=$?
  if grep -qFf "$tmp/needles" "$tmp/out"; then
    die "tofu output contained a key value; output suppressed"
  fi
}
show() { cat "$tmp/out"; }

quiet tofu -chdir=infra init -input=false -no-color
[ "$rc" = 0 ] || { show; die "tofu init failed"; }

quiet tofu -chdir=infra plan -input=false -no-color -detailed-exitcode -out="$tmp/plan"
case "$rc" in
  0) echo "deploy: live Worker already matches $commit; nothing to do"; exit 0 ;;
  2) ;;
  *) show; die "tofu plan failed" ;;
esac

tofu -chdir=infra show -json "$tmp/plan" >"$tmp/plan.json" 2>/dev/null || die "cannot read the saved plan"
echo "deploy: changes for $commit:"
if ! node infra/plan-guard.mjs <"$tmp/plan.json"; then
  [ "$operator" = true ] || die "plan needs the operator (see above): run infra/deploy.sh --operator; nothing applied"
  # Secret variables are marked sensitive, so the plan shows them as (sensitive value).
  quiet tofu -chdir=infra show -no-color "$tmp/plan"
  [ "$rc" = 0 ] || { show; die "cannot show the saved plan"; }
  show
  printf 'deploy: review the plan above. Type %s to apply it, anything else to stop: ' "$commit"
  read -r answer
  [ "$answer" = "$commit" ] || die "not confirmed; nothing applied"
fi

if [ "$check_only" = true ]; then
  echo "deploy: a deploy is needed (--check: nothing applied)"
  exit 0
fi

quiet tofu -chdir=infra apply -input=false -no-color "$tmp/plan"
[ "$rc" = 0 ] || { show; die "tofu apply failed"; }

# The live Worker now matches the commit only if a fresh plan finds nothing to change.
quiet tofu -chdir=infra plan -input=false -no-color -detailed-exitcode
[ "$rc" = 0 ] || { show; die "applied, but a fresh plan still shows changes"; }

status="$(curl -s --max-time 20 -o /dev/null -w '%{http_code}' -X OPTIONS -H "Origin: $ALLOWED_ORIGIN" \
  -H 'Access-Control-Request-Method: POST' "$WORKER_URL/search")" || status=unreachable
[ "$status" = 204 ] || die "applied $commit, but the Worker preflight returned $status (expected 204)"
echo "deploy: Worker deployed at $commit; preflight 204"
