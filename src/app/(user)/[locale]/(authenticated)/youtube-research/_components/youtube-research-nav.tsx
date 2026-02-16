"use client"

import { MonitorPlay, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/shadcn/utils"

const navItems = [
  {
    key: "videos" as const,
    href: "/youtube-research/videos",
    icon: MonitorPlay
  },
  { key: "channels" as const, href: "/youtube-research/channels", icon: Users }
]

export function YouTubeResearchNav() {
  const t = useTranslations("youtubeResearch")
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 border-b pb-2">
      {navItems.map((item) => {
        const fullHref = `/${locale}${item.href}`
        const isActive = pathname.startsWith(fullHref)
        return (
          <Link
            key={item.key}
            href={fullHref}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {t(`nav.${item.key}`)}
          </Link>
        )
      })}
    </nav>
  )
}
