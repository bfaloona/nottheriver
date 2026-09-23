#!/bin/sh
# Feeds synthetic plan text through infra/plan-evidence.sh: a clean plan must be
# written with every host and id redacted, and a leaking plan must write nothing.
set -u

script="$(dirname "$0")/../../infra/plan-evidence.sh"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
fail=0

sha=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
cat >"$tmp/plan.txt" <<EOF
  + resource "cloudflare_workers_script" "proxy" {
      + account_id     = (sensitive value)
      + bindings       = [
          + {
              + name = "BRAVE_API_KEY"
              + text = (sensitive value)
              + type = "secret_text"
            },
          + {
              + name = "OPENROUTER_API_KEY"
              + text = (sensitive value)
              + type = "secret_text"
            },
        ]
      + content_sha256 = "$sha"
      + id             = "0123456789abcdef0123456789abcdef"
      + etag           = "fedcba9876543210fedcba9876543210 0123456789abcdef0123456789abcdef"
      + tag            = "ABCDEF0123456789ABCDEF0123456789"
      + origin         = "https://example-user.github.io/nottheriver/"
      + host           = "nottheriver-proxy.example-sub.workers.dev"
    }
Changes to Outputs:
  + worker_url = "https://nottheriver-proxy.<account-subdomain>.workers.dev; read the subdomain from the dashboard"
EOF

if ! PLAN_TEXT="$tmp/plan.txt" OUT="$tmp/clean.txt" sh "$script"; then
  echo "FAIL: clean plan was refused" >&2
  fail=1
elif grep -nE '[0-9A-Fa-f]{32}([^0-9A-Fa-f]|$)|github\.io|workers\.dev' "$tmp/clean.txt" | grep -v "$sha"; then
  echo "FAIL: redacted plan still has an id or host (lines above)" >&2
  fail=1
elif ! grep -q "$sha" "$tmp/clean.txt"; then
  echo "FAIL: 64-hex content hash was redacted" >&2
  fail=1
fi

# Each leak is assembled at runtime so this file itself passes the pre-commit scan.
expect_refused() {
  printf '%s\n' "$2" >"$tmp/leak.txt"
  if PLAN_TEXT="$tmp/leak.txt" OUT="$tmp/leak-out.txt" sh "$script" 2>/dev/null; then
    echo "FAIL: $1 was written" >&2
    fail=1
  elif [ -e "$tmp/leak-out.txt" ]; then
    echo "FAIL: $1 left an output file" >&2
    fail=1
  fi
}
expect_refused "OpenRouter key" "$(printf '  + text = "sk-or-%s"' TESTTESTTESTTESTTESTTEST)"
expect_refused "Brave key" "$(printf '  + text = "BSA%s"' TESTTESTTESTTESTTESTTEST)"
expect_refused "TF_VAR name" '  + note = "TF_VAR_brave_api_key"'
expect_refused "local path" '  + content_file = "/home/example/nottheriver/proxy/dist/index.js"'
export TF_VAR_brave_api_key=test-brave
expect_refused "key value printed in clear" '  + text = "test-brave"'
unset TF_VAR_brave_api_key

# Without PLAN_TEXT, a non-test key must stop the script before tofu runs, and the
# error must not echo the key back.
mkdir "$tmp/bin"
printf '#!/bin/sh\ntouch "%s/tofu-ran"\n' "$tmp" >"$tmp/bin/tofu"
chmod +x "$tmp/bin/tofu"
wrong=not-a-test-key-value
if PATH="$tmp/bin:$PATH" OUT="$tmp/guard-out.txt" \
  TF_VAR_brave_api_key="$wrong" TF_VAR_openrouter_api_key=test-openrouter \
  TF_VAR_account_id=00000000000000000000000000000000 \
  TF_VAR_allowed_origin=http://localhost:5173 TF_VAR_site_url=http://localhost:5173 \
  sh "$script" >"$tmp/guard.log" 2>&1; then
  echo "FAIL: non-test key was accepted" >&2
  fail=1
elif [ -e "$tmp/tofu-ran" ] || [ -e "$tmp/guard-out.txt" ]; then
  echo "FAIL: non-test key reached tofu or wrote output" >&2
  fail=1
elif ! grep -q '^plan-evidence: set TF_VAR' "$tmp/guard.log"; then
  # Any other early exit (such as a missing proxy build) would pass for the wrong reason.
  echo "FAIL: non-test key was not stopped by the test-values guard" >&2
  fail=1
elif grep -qF -- "$wrong" "$tmp/guard.log"; then
  echo "FAIL: guard printed the key value" >&2
  fail=1
fi

[ "$fail" -eq 0 ] && echo "plan-evidence self-test: ok"
exit "$fail"
