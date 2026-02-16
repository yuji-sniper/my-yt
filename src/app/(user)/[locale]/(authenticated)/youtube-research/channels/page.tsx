import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getQueryClient } from "@/lib/react-query/query-client"
import { ChannelsContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "metadata.youtubeResearchChannels"
  })

  return {
    title: t("title"),
    description: t("description")
  }
}

export default async function ChannelsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChannelsContainer />
    </HydrationBoundary>
  )
}
