import { getTranslations, setRequestLocale } from "next-intl/server"
import { YouTubeResearchNav } from "./_components/youtube-research-nav"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function YouTubeResearchLayout({
  children,
  params
}: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("youtubeResearch")

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("heading")}</h1>
      <YouTubeResearchNav />
      <div className="mt-6">{children}</div>
    </div>
  )
}
