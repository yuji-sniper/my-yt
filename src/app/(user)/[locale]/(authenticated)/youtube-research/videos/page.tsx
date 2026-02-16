import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getVideoCategoriesQuery } from "@/features/youtube-research/queries/get-video-categories"
import { videoCategoriesKey } from "@/features/youtube-research/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { VideosContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "metadata.youtubeResearchVideos"
  })

  return {
    title: t("title"),
    description: t("description")
  }
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: videoCategoriesKey(),
    queryFn: () => getVideoCategoriesQuery()
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VideosContainer />
    </HydrationBoundary>
  )
}
