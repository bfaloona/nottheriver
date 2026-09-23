#!/bin/sh
# Fails if a built bundle contains an API key.
# Usage: bundle-secret-scan.sh [dir...]   (default: dist and proxy/dist, whichever exist)
# Exit: 0 clean, 1 secret found or scan error, 2 nothing to scan.
#
# Self-test: plant each sample in an empty temp dir and expect exit 1:
#   printf 'sk-or-%s\n' TESTTESTTESTTESTTESTTEST > "$tmp/a.js"   # split so the pre-commit hook passes
#   printf 'const apiKey="%s"\n' "$(head -c 30 /dev/urandom | base64)" > "$tmp/b.js"
#   sh .github/scripts/bundle-secret-scan.sh "$tmp"
# A bare random string with no key-like name beside it is expected to pass:
# gitleaks' generic rule needs one, and a bare-string rule would flag every hash.
set -u

config="$(dirname "$0")/../../.gitleaks.toml"
[ "$#" -gt 0 ] || set -- dist proxy/dist

found=0
status=0
for dir in "$@"; do
  [ -d "$dir" ] || continue
  found=1
  # --config is required: gitleaks otherwise looks for .gitleaks.toml inside the scanned dir.
  gitleaks dir --config "$config" --redact --no-banner "$dir" || status=1
  # Belt and braces for the two keys this project holds; -l prints file names, never the key.
  # The BSA boundary stops a match starting mid-base64 (data: URIs, integrity hashes).
  grep -rlE 'sk-or-[A-Za-z0-9_-]{20,}|(^|[^A-Za-z0-9+/])BSA[A-Za-z0-9_-]{20,}' "$dir"
  rc=$?
  if [ "$rc" -eq 0 ]; then
    echo "bundle-secret-scan: key pattern found in $dir" >&2
    status=1
  elif [ "$rc" -ne 1 ]; then
    # A file grep could not read was not scanned, so fail rather than pass.
    echo "bundle-secret-scan: grep failed in $dir (exit $rc)" >&2
    status=1
  fi
done

if [ "$found" -eq 0 ]; then
  echo "bundle-secret-scan: nothing to scan (run a build first)" >&2
  exit 2
fi
exit "$status"
