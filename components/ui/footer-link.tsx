import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FooterLinkProps {
  href: string
  className?: string
  children: React.ReactNode
}

export function FooterLink({ href, className, children }: FooterLinkProps) {
  return (
    <Link href={href} className={cn("hover:underline transition-colors", className)}>
      {children}
    </Link>
  )
}

