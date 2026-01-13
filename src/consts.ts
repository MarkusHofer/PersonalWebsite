import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Markus Hofer',
  description:
    'PhD Candidate in Complexity Science studying opinion dynamics and polarization.',
  href: 'https://www.markushofer.io',
  author: 'Markus Hofer',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/publications',
    label: 'publications',
  },
  {
    href: '/media',
    label: 'Press',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [

  {
    href: 'mailto:hello@markushofer.io',
    label: 'Email',
  },
  {
    href: 'https://linkedin.com/in/-markus-hofer',
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/markushofer',
    label: 'GitHub',
  },
  {
    href: "https://orcid.org/0009-0009-0258-2415",
    label: 'ORCID',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'simple-icons:github',
  Email: 'lucide:mail',
  LinkedIn: 'simple-icons:linkedin',
  ORCID: 'simple-icons:orcid',
}
