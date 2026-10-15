#!/usr/bin/env bash
# Netlify build: deploys the Sanity Studio when studio/ changed, then builds the Astro site.
set -e

if [ -z "$CACHED_COMMIT_REF" ] || ! git diff --quiet "$CACHED_COMMIT_REF" "$COMMIT_REF" -- studio 2>/dev/null; then
  if [ -n "$SANITY_AUTH_TOKEN" ]; then
    echo "studio/ changed - deploying Sanity Studio"
    (cd studio && npm ci && npx sanity deploy) || echo "WARNING: Sanity Studio deploy failed, continuing with site build"
  else
    echo "SANITY_AUTH_TOKEN not set - skipping Studio deploy"
  fi
else
  echo "No studio/ changes - skipping Studio deploy"
fi

npm run build
