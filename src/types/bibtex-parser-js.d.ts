declare module 'bibtex-parser-js' {
  export interface BibTeXEntry {
    citationKey: string
    entryType: string
    [key: string]: any
  }

  export function toJSON(input: string): BibTeXEntry[]
}


