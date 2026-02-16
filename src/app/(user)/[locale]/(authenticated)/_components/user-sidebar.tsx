"use client"

import {
  BarChart3,
  CreditCard,
  Home,
  LogOut,
  MonitorPlay,
  Settings
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar"
import { useGetAuthUserQuery } from "@/features/auth/hooks/queries/useGetAuthUserQuery"
import { useSignOut } from "../_hooks/use-sign-out"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function UserSidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("sidebar")
  const tAccount = useTranslations("userAccount")
  const { data } = useGetAuthUserQuery({ orError: false })
  const authUser = data?.authUser
  const { signOut, isPending } = useSignOut()

  const navItems = [
    {
      title: t("home"),
      href: `/${locale}/home`,
      icon: Home
    },
    {
      title: t("youtubeResearch"),
      href: `/${locale}/youtube-research/videos`,
      icon: MonitorPlay
    },
    {
      title: t("pricing"),
      href: `/${locale}/pricing`,
      icon: CreditCard
    },
    {
      title: t("settings"),
      href: `/${locale}/settings`,
      icon: Settings
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="size-4" />
          </div>
          <span className="text-lg font-semibold">YT Research</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {authUser && (
          <>
            <SidebarSeparator />
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="size-8">
                {authUser.image ? (
                  <AvatarImage src={authUser.image} alt={authUser.name} />
                ) : null}
                <AvatarFallback className="text-xs">
                  {getInitials(authUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col truncate">
                <span className="truncate text-sm font-medium">
                  {authUser.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {authUser.email}
                </span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={signOut}
                  disabled={isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  <span>
                    {isPending ? tAccount("loggingOut") : tAccount("logout")}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
