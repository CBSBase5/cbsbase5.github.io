#!/bin/sh
# Publish checked Autumn 2 activities: validate, list in published.txt, build, commit, push.
#   sh data/a2/_build/publish.sh "Commit message" slug [slug ...]
set -e
cd "$(dirname "$0")/../../.."
MSG="$1"; shift
node data/a2/_build/validate.js "$@"
for s in "$@"; do grep -qx "$s" data/a2/_build/published.txt || echo "$s" >> data/a2/_build/published.txt; done
python3 data/a2/_build/build_a2.py "$@" | tail -1
for s in "$@"; do git add "data/a2/$s.js" */"a2-$s.html"; done
git add data/a2/drops.js data/a2/library.js data/a2/_build/published.txt
git commit -q -m "$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YYrVTiWRkFYEh5QDTuEo6b"
git fetch -q origin main && git rebase -q --autostash origin/main && git push -q origin HEAD:main
git log -1 --oneline
