// Oğuzhan Kaya, 2200004591
// Use ASCII markers so listings cannot reorder Unicode letters under XeTeX.
import { readFileSync } from 'node:fs'

const tex = readFileSync(process.argv[2], 'utf8')
const markCharacters = (code) =>
  code.replace(/[çÇğĞıİöÖşŞüÜ→–]/g, (character) => {
    const hex = character.codePointAt(0).toString(16).padStart(4, '0').toUpperCase()
    return '@U' + hex + '@'
  })

const withListingMarkers = tex.replace(
  /\\begin\{lstlisting\}[\s\S]*?\\end\{lstlisting\}/g,
  markCharacters,
)
const withInlineMarkers = withListingMarkers.replace(
  /(\\lstinline)([^\w\s\\])([^\r\n]*?)\2/g,
  (_, command, delimiter, code) => command + delimiter + markCharacters(code) + delimiter,
)

process.stdout.write(withInlineMarkers.replaceAll('PIPECHAR', '|'))
