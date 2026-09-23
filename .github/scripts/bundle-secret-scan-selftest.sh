#!/bin/sh
# Proves bundle-secret-scan.sh can go red: each planted key must make it exit 1,
# and a clean directory must exit 0 (otherwise a missing gitleaks binary, which
# also exits 1, would pass the planted cases for the wrong reason).
set -u

scan="$(dirname "$0")/bundle-secret-scan.sh"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
fail=0

# $1 label, $2 expected exit, $3 file content
expect() {
  dir="$tmp/$1"
  mkdir "$dir"
  printf '%s\n' "$3" >"$dir/index.js"
  sh "$scan" "$dir" >/dev/null 2>&1
  rc=$?
  if [ "$rc" -ne "$2" ]; then
    echo "FAIL: $1 exited $rc, expected $2" >&2
    fail=1
  fi
}

# Keys are assembled at runtime so this file itself passes the pre-commit scan.
expect openrouter 1 "$(printf 'fetch(u,{headers:{a:"sk-or-%s"}});' TESTTESTTESTTESTTESTTEST)"
expect brave 1 "$(printf 'fetch(u,{headers:{a:"BSA%s"}});' TESTTESTTESTTESTTESTTEST)"
# An unknown key format under a key-like name must trip gitleaks' generic rule.
expect generic 1 "$(printf 'const apiKey="%s%s";' q7Xk2Rm9Tz4Lw8Hb3Nv6 Pc1Ys5Jd0Gf7Ua2Ke9Mh)"
# "BSA" inside a base64 run is not a key; the scan's left boundary must skip it.
expect clean 0 'const img="data:image/png;base64,AAAABSAAAAAAAAAAAAAAAAAAAAAAAAAA";'

[ "$fail" -eq 0 ] && echo "bundle-secret-scan self-test: ok"
exit "$fail"
