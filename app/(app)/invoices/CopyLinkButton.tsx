'use client'

import { useState } from 'react'

export default function CopyLinkButton({ invoiceId }: { invoiceId: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(`${window.location.origin}/pay/${invoiceId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={copy} className="text-xs text-primary hover:underline mt-0.5 block">
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}
