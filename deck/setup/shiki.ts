import { defineShikiSetup } from '@slidev/types'

// Deliberately flat code colouring, as in the reveal deck: a grammar's idea
// of a "keyword" tells the audience nothing and pulls the eye to the wrong
// token. Every token is one colour; only comments differ, because that
// distinction carries meaning. Values mirror the tokens in style.css.
const flat = {
  name: 'isx-flat',
  type: 'dark' as const,
  fg: '#e6edf7',
  bg: '#0e1626',
  settings: [
    { settings: { foreground: '#e6edf7', background: '#0e1626' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8b98b0' } },
  ],
}

export default defineShikiSetup(() => ({
  themes: { dark: flat, light: flat },
}))
