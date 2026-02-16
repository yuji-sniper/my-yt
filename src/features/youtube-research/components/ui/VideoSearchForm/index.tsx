"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/shadcn/utils"
import {
  type SearchTrendingVideosParams,
  VIDEO_DURATION_VALUES,
  VIDEO_SEARCH_ORDER_VALUES
} from "../../../types/trending-video"
import type { VideoCategory } from "../../../types/video-category"

const videoSearchFormSchema = z
  .object({
    keyword: z.string().optional(),
    categoryId: z.string().optional(),
    period: z.enum(["7d", "30d", "90d", "custom"]),
    customDateFrom: z.date().optional(),
    customDateTo: z.date().optional(),
    regionCode: z.enum(["none", "JP", "US"]),
    relevanceLanguage: z.enum(["none", "ja", "en"]),
    videoDuration: z.enum(VIDEO_DURATION_VALUES),
    order: z.enum(VIDEO_SEARCH_ORDER_VALUES)
  })
  .refine(
    (data) => {
      if (data.period === "custom") {
        return data.customDateFrom !== undefined
      }
      return true
    },
    { path: ["customDateFrom"] }
  )

type VideoSearchFormValues = z.infer<typeof videoSearchFormSchema>

const VIDEO_SEARCH_FORM_DEFAULTS: VideoSearchFormValues = {
  keyword: "",
  categoryId: "all",
  period: "7d",
  customDateFrom: undefined,
  customDateTo: undefined,
  regionCode: "none",
  relevanceLanguage: "none",
  videoDuration: "any",
  order: "viewCount"
}

type Props = {
  categories: VideoCategory[]
  onSearch: (params: SearchTrendingVideosParams) => void
  isSearching: boolean
}

function truncateToDate(date: Date): string {
  return date.toISOString().split("T")[0] + "T00:00:00.000Z"
}

function calculatePublishedAfter(
  period: VideoSearchFormValues["period"],
  customDateFrom?: Date
): string {
  if (period === "custom" && customDateFrom) {
    return truncateToDate(customDateFrom)
  }

  const now = new Date()
  const daysMap: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90
  }

  const days = daysMap[period] ?? 7
  now.setDate(now.getDate() - days)
  return truncateToDate(now)
}

function calculatePublishedBefore(
  period: VideoSearchFormValues["period"],
  customDateTo?: Date
): string | undefined {
  if (period === "custom" && customDateTo) {
    return truncateToDate(customDateTo)
  }
  return undefined
}

function formatDateLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date)
}

export function VideoSearchForm({ categories, onSearch, isSearching }: Props) {
  const t = useTranslations("youtubeResearch")

  const form = useForm<VideoSearchFormValues>({
    resolver: zodResolver(videoSearchFormSchema),
    defaultValues: VIDEO_SEARCH_FORM_DEFAULTS
  })

  const watchPeriod = form.watch("period")

  const handleSubmit = (values: VideoSearchFormValues) => {
    const params: SearchTrendingVideosParams = {
      publishedAfter: calculatePublishedAfter(
        values.period,
        values.customDateFrom
      ),
      publishedBefore: calculatePublishedBefore(
        values.period,
        values.customDateTo
      )
    }

    if (values.keyword) params.keyword = values.keyword
    if (values.categoryId !== "all") params.categoryId = values.categoryId
    if (values.regionCode !== "none") params.regionCode = values.regionCode
    if (values.relevanceLanguage !== "none")
      params.relevanceLanguage = values.relevanceLanguage
    if (values.videoDuration !== "any")
      params.videoDuration = values.videoDuration
    if (values.order !== "relevance") params.order = values.order

    onSearch(params)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("search.keyword")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("search.keywordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regionCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("search.region")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("search.regionOptions.none")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("search.regionOptions.none")}
                    </SelectItem>
                    <SelectItem value="JP">
                      {t("search.regionOptions.JP")}
                    </SelectItem>
                    <SelectItem value="US">
                      {t("search.regionOptions.US")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("search.category")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("search.categoryPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("search.categoryAll")}
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.categoryId} value={cat.categoryId}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("search.period")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="7d">
                      {t("search.periodOptions.7d")}
                    </SelectItem>
                    <SelectItem value="30d">
                      {t("search.periodOptions.30d")}
                    </SelectItem>
                    <SelectItem value="90d">
                      {t("search.periodOptions.90d")}
                    </SelectItem>
                    <SelectItem value="custom">
                      {t("search.periodOptions.custom")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relevanceLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("search.language")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("search.languageOptions.none")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("search.languageOptions.none")}
                    </SelectItem>
                    <SelectItem value="ja">
                      {t("search.languageOptions.ja")}
                    </SelectItem>
                    <SelectItem value="en">
                      {t("search.languageOptions.en")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("search.duration")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="any">
                      {t("search.durationOptions.any")}
                    </SelectItem>
                    <SelectItem value="short">
                      {t("search.durationOptions.short")}
                    </SelectItem>
                    <SelectItem value="medium">
                      {t("search.durationOptions.medium")}
                    </SelectItem>
                    <SelectItem value="long">
                      {t("search.durationOptions.long")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("search.order")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="relevance">
                      {t("search.orderOptions.relevance")}
                    </SelectItem>
                    <SelectItem value="date">
                      {t("search.orderOptions.date")}
                    </SelectItem>
                    <SelectItem value="rating">
                      {t("search.orderOptions.rating")}
                    </SelectItem>
                    <SelectItem value="title">
                      {t("search.orderOptions.title")}
                    </SelectItem>
                    <SelectItem value="viewCount">
                      {t("search.orderOptions.viewCount")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchPeriod === "custom" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="customDateFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("search.dateFrom")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="size-4" />
                          {field.value
                            ? formatDateLabel(field.value, "ja")
                            : t("search.datePlaceholder")}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customDateTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("search.dateTo")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="size-4" />
                          {field.value
                            ? formatDateLabel(field.value, "ja")
                            : t("search.datePlaceholder")}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-center mt-4">
          <Button type="submit" disabled={isSearching} className="w-60">
            {isSearching ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("search.searching")}
              </>
            ) : (
              <>
                <Search className="size-4" />
                {t("search.button")}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
