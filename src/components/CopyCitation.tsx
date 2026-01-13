'use client'

import { Check, Clipboard } from 'lucide-react'
import { useState } from 'react'

interface CopyCitationProps {
  bibtex: string
}

export function CopyCitation({ bibtex }: CopyCitationProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bibtex)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-sm text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
      title="Copy BibTeX"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Clipboard className="w-3.5 h-3.5" />
      )}
      {copied ? 'Copied!' : 'BibTeX'}
    </button>
  )
}

