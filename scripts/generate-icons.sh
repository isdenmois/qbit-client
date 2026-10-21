#!/usr/bin/env bash
# Generates PWA/Android icon assets from public/favicon.svg and the UI icon set.
# Outputs are committed; CI does not run this. Requires rsvg-convert and ImageMagick (`magick`).
# Glyph sizes keep every painted pixel inside the maskable safe zone (radius 0.4 * tile):
# the favicon's painted radius is 265.46px at a 512px render, so render size = tile * 0.4 * 512/265.46.
set -euo pipefail
cd "$(dirname "$0")/.."

tile() { # $1 = tile px, $2 = glyph px, $3 = output
  rsvg-convert -w "$2" -h "$2" public/favicon.svg \
    | magick - -background '#191724' -gravity center -extent "${1}x${1}" "png:public/$3"
}

tile 192 141 icon-192.png
tile 512 375 icon-512.png
tile 512 375 maskable-512.png
tile 180 132 apple-touch-icon-180.png

shortcut() { # $1 = source svg, $2 = output
  sed 's/currentColor/#e0def4/g' "$1" \
    | rsvg-convert -w 72 -h 72 \
    | magick - -background '#191724' -gravity center -extent 96x96 "png:public/$2"
}

shortcut src/shared/ui/icons/search.svg shortcut-search.png
shortcut src/shared/ui/icons/plus.svg shortcut-add.png
