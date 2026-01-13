import { toJSON } from 'bibtex-parser-js'
import { readFileSync } from 'fs'
import { join } from 'path'

export type BibTeXEntry = {
  citationKey: string
  entryType: string
  entryTags?: Record<string, string> // Fields are stored in entryTags with uppercase keys
  [key: string]: any // Also allow direct access for compatibility
}

export type Publication = {
  key: string
  type: string
  authors: string[]
  year: string
  title: string
  venue?: string
  volume?: string
  number?: string
  pages?: string
  doi?: string
  url?: string
  note?: string
  editorship?: string
  keywords?: string[]
}

function parseAuthors(authorString: string): string[] {
  return authorString
    .split(' and ')
    .map((author) => author.trim())
    .filter(Boolean)
}

function parseKeywords(keywordString: string): string[] {
  return keywordString
    .split(/[,;]/) // Split by comma or semicolon
    .map((keyword) => keyword.trim())
    .filter(Boolean)
}

function formatPublication(entry: BibTeXEntry): Publication {
  // Fields are stored in entryTags with uppercase keys, fallback to direct access
  const tags = entry.entryTags || {}
  const getField = (key: string): string => {
    // Try uppercase in entryTags first, then lowercase, then direct access
    return tags[key.toUpperCase()] || tags[key.toLowerCase()] || entry[key] || ''
  }
  
  const authors = parseAuthors(getField('author') || getField('editor'))
  const year = getField('year')
  const title = getField('title')
  
  // Determine venue (journal or booktitle)
  const venue = getField('journal') || getField('booktitle') || getField('publisher') || ''
  
  // Handle both "number" and "issue" fields
  const number = getField('number') || getField('issue')
  
  return {
    key: entry.citationKey,
    type: entry.entryType.toLowerCase(),
    authors,
    year,
    title,
    venue: venue || undefined,
    volume: getField('volume'),
    number: number || undefined,
    pages: getField('pages'),
    doi: getField('doi'),
    url: getField('url') || getField('URL'),
    note: getField('note'),
    editorship: getField('editorship'),
    keywords: parseKeywords(getField('keywords')),
  }
}

export function parseBibTeX(bibtexContent: string): Publication[] {
  try {
    const entries: BibTeXEntry[] = toJSON(bibtexContent) || []
    return entries.map((entry) => formatPublication(entry))
  } catch (error) {
    console.error('Error parsing BibTeX:', error)
    return []
  }
}

export async function loadPublications(): Promise<Publication[]> {
  try {
    const bibtexPath = join(process.cwd(), 'src', 'content', 'publications.bib')
    const bibtexContent = readFileSync(bibtexPath, 'utf-8')
    const publications = parseBibTeX(bibtexContent)
    console.log(`Loaded ${publications.length} publications from BibTeX`)
    return publications
  } catch (error) {
    console.error('Error loading publications:', error)
    return []
  }
}

export function filterGuestEditorships(publications: Publication[]): Publication[] {
  // Filter for guest editorships - check for editorship field
  return publications.filter((pub) => {
    const editorship = pub.editorship?.toLowerCase() || ''
    // If editorship field exists and is truthy, it's a guest editorship
    return editorship === 'true' || editorship === 'yes' || editorship === '1' || (pub.editorship && pub.editorship.trim() !== '')
  })
}

export function filterPeerReviewed(publications: Publication[]): Publication[] {
  // Filter for typical peer-reviewed publication types, but exclude guest editorships
  const guestEditorships = filterGuestEditorships(publications)
  const guestEditorshipKeys = new Set(guestEditorships.map(pub => pub.key))
  
  const peerReviewedTypes = ['article', 'inproceedings', 'incollection', 'inbook']
  return publications.filter((pub) => 
    peerReviewedTypes.includes(pub.type.toLowerCase()) &&
    !guestEditorshipKeys.has(pub.key)
  )
}

export function sortPublicationsByYear(publications: Publication[]): Publication[] {
  return [...publications].sort((a, b) => {
    const yearA = parseInt(a.year || '0')
    const yearB = parseInt(b.year || '0')
    return yearB - yearA // Most recent first
  })
}

export function formatCitation(pub: Publication): string {
  const authors = pub.authors.join(', ')
  const year = pub.year ? ` (${pub.year})` : ''
  const title = pub.title ? ` ${pub.title}.` : ''
  const venue = pub.venue ? ` ${pub.venue}` : ''
  const volume = pub.volume ? `, ${pub.volume}` : ''
  const number = pub.number ? `(${pub.number})` : ''
  const pages = pub.pages ? `, ${pub.pages}` : ''
  
  let citation = `${authors}${year}${title}`
  if (venue) citation += venue
  if (volume) citation += volume
  if (number) citation += number
  if (pages) citation += pages
  
  return citation
}

export function generateBibtex(pub: Publication): string {
  const lines: string[] = [`@${pub.type}{${pub.key},`]
  
  if (pub.authors.length > 0) {
    lines.push(`  author = {${pub.authors.join(' and ')}},`)
  }
  if (pub.title) lines.push(`  title = {${pub.title}},`)
  if (pub.venue) {
    const venueField = pub.type === 'article' ? 'journal' : 'booktitle'
    lines.push(`  ${venueField} = {${pub.venue}},`)
  }
  if (pub.year) lines.push(`  year = {${pub.year}},`)
  if (pub.volume) lines.push(`  volume = {${pub.volume}},`)
  if (pub.number) lines.push(`  number = {${pub.number}},`)
  if (pub.pages) lines.push(`  pages = {${pub.pages}},`)
  if (pub.doi) lines.push(`  doi = {${pub.doi}},`)
  if (pub.url) lines.push(`  url = {${pub.url}},`)
  if (pub.note) lines.push(`  note = {${pub.note}},`)
  if (pub.keywords && pub.keywords.length > 0) lines.push(`  keywords = {${pub.keywords.join(', ')}},`)
  
  lines.push('}')
  return lines.join('\n')
}
