import type { ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-4 py-8 relative">
      <main className="flex-1 flex flex-col items-center">{children}</main>
    </div>
  )
}

