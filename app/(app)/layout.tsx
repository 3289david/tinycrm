import Sidebar from '@/components/Sidebar'
import SessionWrapper from '@/components/SessionWrapper'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionWrapper>
      <div className="flex min-h-screen bg-canvas">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </SessionWrapper>
  )
}
