"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { authClient } from "@/lib/better-auth/auth-client"
import { getQueryClient } from "@/lib/react-query/query-client"

export function useSignOut() {
  const locale = useLocale()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut()
    },
    onSuccess: () => {
      getQueryClient().clear()
      router.push(`/${locale}/sign-in`)
    }
  })

  return {
    signOut: () => mutation.mutate(),
    isPending: mutation.isPending
  }
}
