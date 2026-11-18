#!/bin/sh
# Oğuzhan Kaya, 2200004591
# Builds latex/guide.pdf from README.md. Run from the project folder: sh latex/build.sh
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_dir"
command -v pandoc >/dev/null 2>&1 || { echo 'pandoc was not found.' >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo 'node was not found.' >&2; exit 1; }
engine=${1:-auto}
if [ "$engine" = auto ]; then
  if command -v tectonic >/dev/null 2>&1; then engine=tectonic; else engine=xelatex; fi
fi
case "$engine" in
  tectonic) command -v tectonic >/dev/null 2>&1 || { echo 'tectonic was not found.' >&2; exit 1; } ;;
  xelatex) command -v latexmk >/dev/null 2>&1 && command -v xelatex >/dev/null 2>&1 || { echo 'latexmk and xelatex were not found.' >&2; exit 1; } ;;
  *) echo 'Usage: sh latex/build.sh [tectonic|xelatex]' >&2; exit 1 ;;
esac
trap 'rm -f "$project_dir/latex/README.for-latex.md" "$project_dir/latex/body.fixed.tex"' EXIT HUP INT TERM
# The emoji has no glyph in the code font, so the LaTeX copy names it in words.
# A | inside code in a Markdown table is written \| ; pandoc keeps the backslash, so I swap it out and back.
sed -e 's/💈/<barber-pole emoji>/g' -e 's/\\|/PIPECHAR/g' README.md > latex/README.for-latex.md
pandoc latex/README.for-latex.md -o latex/body.tex \
  --listings --wrap=preserve --shift-heading-level-by=-1
{
  printf '%s\n' '% Oğuzhan Kaya, 2200004591' '% Generated from README.md by latex/build.sh.'
  node latex/prepare-listings.mjs latex/body.tex
} > latex/body.fixed.tex
mv latex/body.fixed.tex latex/body.tex
cd latex
if [ "$engine" = tectonic ]; then
  tectonic --untrusted --keep-logs guide.tex
else
  latexmk -xelatex -interaction=nonstopmode -halt-on-error guide.tex
fi
