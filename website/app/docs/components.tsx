import Link from 'next/link'

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-ink mb-4" style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.64px', lineHeight: 1.1 }}>
      {children}
    </h1>
  )
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-ink mt-10 mb-3" style={{ fontSize: 18, fontWeight: 300, letterSpacing: '-0.18px' }}>
      {children}
    </h2>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-ink mt-6 mb-2 font-normal text-sm" style={{ letterSpacing: '-0.1px' }}>
      {children}
    </h3>
  )
}

export function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-ink-mute text-sm mb-4 leading-relaxed">{children}</p>
  )
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre
      className="bg-canvas-soft border border-hairline rounded-lg p-4 text-xs text-ink overflow-x-auto mb-6"
      style={{ fontFamily: 'ui-monospace, "Cascadia Code", monospace', lineHeight: 1.75 }}
    >
      {children}
    </pre>
  )
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-primary-subdued pl-4 mb-6">
      <p className="text-ink-mute text-sm leading-relaxed">{children}</p>
    </div>
  )
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-ruby pl-4 mb-6">
      <p className="text-ink-mute text-sm leading-relaxed">{children}</p>
    </div>
  )
}

export function NextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-primary text-sm font-normal hover:underline flex items-center gap-1"
    >
      {children} <span aria-hidden>→</span>
    </Link>
  )
}

export function PrevLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-ink-mute text-sm font-normal hover:text-ink flex items-center gap-1"
    >
      <span aria-hidden>←</span> {children}
    </Link>
  )
}
