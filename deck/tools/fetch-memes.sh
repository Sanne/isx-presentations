#!/usr/bin/env bash
# Fetches the Simpsons frames used on the "Homer solved this in 1995" slide,
# from Frinkiac. They're shown in the talk as commentary but deliberately not
# committed: this repository is public, and republishing them is a different
# thing from showing them. Without them the slide falls back to an original
# drawing (components/DrinkingBird.vue).
set -euo pipefail
cd "$(dirname "$0")/../public"
mkdir -p memes
for t in 929220 978436 1062478; do
  curl -fsSL -o "memes/homer-$t.jpg" "https://frinkiac.com/img/S07E07/$t.jpg"
done
echo "Fetched $(ls memes | wc -l | tr -d ' ') frames into public/memes/"
