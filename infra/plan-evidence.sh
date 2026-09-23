#!/bin/sh
# Writes a redacted `tofu plan` to docs/evidence/tofu-plan.txt.
# Usage: CLOUDFLARE_API_TOKEN=... TF_VAR_...=<test values below> infra/plan-evidence.sh
#   PLAN_TEXT=<file>  redact that text instead of running tofu (used by the self-test)
#   OUT=<file>        write somewhere other than docs/evidence/tofu-plan.txt
#
# A saved plan file stores every variable value in plain text, and so does local
# state after `tofu apply` (*.tfstate is gitignored, but the file on disk holds
# the API keys unencrypted). So this script only runs against test values, and
# refuses to write anything that still looks like a secret or an account name.
set -eu

root="$(cd "$(dirname "$0")/.." && pwd)"
out="${OUT:-$root/docs/evidence/tofu-plan.txt}"

hex32='(^|[^0-9A-Fa-f])[0-9A-Fa-f]{32}($|[^0-9A-Fa-f])'
# Replacement tokens must not themselves match anything in the residual list.
# The 32-hex rule runs twice because adjacent ids share a boundary character.
redact() {
  sed -E \
    -e "s/$hex32/\\1[redacted-id]\\2/g" \
    -e "s/$hex32/\\1[redacted-id]\\2/g" \
    -e 's/[^[:space:]"]*\.workers\.dev/[redacted-worker-host]/g' \
    -e 's/[^[:space:]"]*\.github\.io/[redacted-pages-host]/g'
}

residual() {
  if grep -qE "$hex32|workers\.dev|github\.io|sk-or-|BSA[A-Za-z0-9_-]{20,}|TF_VAR|/Users/|/home/" "$1"; then
    return 0
  fi
  # Catches a key variable that lost `sensitive = true` and printed its value.
  # The needle goes through a file because a grep argument shows in the process list.
  for value in "${TF_VAR_brave_api_key:-}" "${TF_VAR_openrouter_api_key:-}" "${CLOUDFLARE_API_TOKEN:-}"; do
    [ -n "$value" ] || continue
    printf '%s\n' "$value" >"$tmp/needle"
    if grep -qFf "$tmp/needle" "$1"; then
      return 0
    fi
  done
  return 1
}

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp" "$root/infra/plan.tfplan"' EXIT

if [ -n "${PLAN_TEXT:-}" ]; then
  cp "$PLAN_TEXT" "$tmp/plan.txt"
else
  # Values are compared, never printed, so a real key never reaches the terminal.
  zero_id=00000000000000000000000000000000
  if [ "${TF_VAR_brave_api_key:-}" != test-brave ] ||
    [ "${TF_VAR_openrouter_api_key:-}" != test-openrouter ] ||
    [ "${TF_VAR_account_id:-}" != "$zero_id" ] ||
    [ "${TF_VAR_allowed_origin:-}" != http://localhost:5173 ] ||
    [ "${TF_VAR_site_url:-}" != http://localhost:5173 ]; then
    echo "plan-evidence: set TF_VAR_brave_api_key=test-brave TF_VAR_openrouter_api_key=test-openrouter TF_VAR_account_id=$zero_id TF_VAR_allowed_origin=http://localhost:5173 TF_VAR_site_url=http://localhost:5173" >&2
    exit 1
  fi
  if [ ! -f "$root/proxy/dist/index.js" ]; then
    echo "plan-evidence: proxy/dist/index.js missing; run npm run build:proxy first" >&2
    exit 1
  fi
  tofu -chdir="$root/infra" plan -input=false -no-color -out=plan.tfplan >/dev/null
  tofu -chdir="$root/infra" show -no-color plan.tfplan >"$tmp/plan.txt"
fi

mkdir "$tmp/evidence"
redact <"$tmp/plan.txt" >"$tmp/evidence/tofu-plan.txt"
if residual "$tmp/evidence/tofu-plan.txt"; then
  echo "plan-evidence: redacted plan still contains a secret or account-identifying value; nothing written" >&2
  exit 1
fi
gitleaks dir --config "$root/.gitleaks.toml" --redact --no-banner "$tmp/evidence"

mkdir -p "$(dirname "$out")"
mv "$tmp/evidence/tofu-plan.txt" "$out"
echo "plan-evidence: wrote $out"
