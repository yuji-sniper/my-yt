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
  CHANNEL_SEARCH_ORDER_VALUES,
  type SearchGrowingChannelsParams
} from "../../../types/growing-channel"

const channelSearchFormSchema = z
  .object({
    keyword: z.string().optional(),
    period: z.enum(["3m", "6m", "1y", "custom"]),
    customDateFrom: z.date().optional(),
    customDateTo: z.date().optional(),
    regionCode: z.enum(["none", "JP", "US"]),
    relevanceLanguage: z.enum(["none", "ja", "en"]),
    subscriberCountMin: z.string().optional(),
    subscriberCountMax: z.string().optional(),
    order: z.enum(CHANNEL_SEARCH_ORDER_VALUES)
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

type ChannelSearchFormValues = z.infer<typeof channelSearchFormSchema>

const CHANNEL_SEARCH_FORM_DEFAULTS: ChannelSearchFormValues = {
  keyword: "",
  period: "3m",
  customDateFrom: undefined,
  customDateTo: undefined,
  regionCode: "none",
  relevanceLanguage: "none",
  subscriberCountMin: "",
  subscriberCountMax: "",
  order: "date"
}

type Props = {
  onSearch: (params: SearchGrowingChannelsParams) => void
  isSearching: boolean
}

const calculatePublishedAfter = (
  period: ChannelSearchFormValues["period"],
  customDateFrom?: Date
): string => {
  if (period === "custom" && customDateFrom) {
    return customDateFrom.toISOString()
  }

  const now = new Date()
  const monthsMap: Record<string, number> = {
    "3m": 3,
    "6m": 6,
    "1y": 12
  }

  const months = monthsMap[period] ?? 3
  now.setMonth(now.getMonth() - months)
  return now.toISOString()
}

const calculatePublishedBefore = (
  period: ChannelSearchFormValues["period"],
  customDateTo?: Date
): string | undefined => {
  if (period === "custom" && customDateTo) {
    return customDateTo.toISOString()
  }
  return undefined
}

const formatDateLabel = (date: Date, locale: string): string => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date)
}

export function ChannelSearchForm({ onSearch, isSearching }: Props) {
  const t = useTranslations("youtubeResearch")

  const form = useForm<ChannelSearchFormValues>({
    resolver: zodResolver(channelSearchFormSchema),
    defaultValues: CHANNEL_SEARCH_FORM_DEFAULTS
  })

  const watchPeriod = form.watch("period")

  const handleSubmit = (values: ChannelSearchFormValues) => {
    const params: SearchGrowingChannelsParams = {
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
    if (values.regionCode !== "none") params.regionCode = values.regionCode
    if (values.relevanceLanguage !== "none")
      params.relevanceLanguage = values.relevanceLanguage
    if (values.subscriberCountMin) {
      const min = Number.parseInt(values.subscriberCountMin, 10)
      if (!Number.isNaN(min)) params.subscriberCountMin = min
    }
    if (values.subscriberCountMax) {
      const max = Number.parseInt(values.subscriberCountMax, 10)
      if (!Number.isNaN(max)) params.subscriberCountMax = max
    }
    if (values.order !== "date") params.order = values.order

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
                <FormLabel>{t("channelSearch.keyword")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("channelSearch.keywordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("channelSearch.createdPeriod")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3m">
                      {t("channelSearch.periodOptions.3m")}
                    </SelectItem>
                    <SelectItem value="6m">
                      {t("channelSearch.periodOptions.6m")}
                    </SelectItem>
                    <SelectItem value="1y">
                      {t("channelSearch.periodOptions.1y")}
                    </SelectItem>
                    <SelectItem value="custom">
                      {t("channelSearch.periodOptions.custom")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regionCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("channelSearch.region")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("channelSearch.regionOptions.none")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("channelSearch.regionOptions.none")}
                    </SelectItem>
                    <SelectItem value="JP">
                      {t("channelSearch.regionOptions.JP")}
                    </SelectItem>
                    <SelectItem value="US">
                      {t("channelSearch.regionOptions.US")}
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
                <FormLabel>{t("channelSearch.language")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("channelSearch.languageOptions.none")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("channelSearch.languageOptions.none")}
                    </SelectItem>
                    <SelectItem value="ja">
                      {t("channelSearch.languageOptions.ja")}
                    </SelectItem>
                    <SelectItem value="en">
                      {t("channelSearch.languageOptions.en")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscriberCountMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("channelSearch.subscriberCount")}</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder={t("channelSearch.subscriberMin")}
                      {...field}
                    />
                  </FormControl>
                  <span className="text-muted-foreground">〜</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder={t("channelSearch.subscriberMax")}
                    {...form.register("subscriberCountMax")}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("channelSearch.order")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="relevance">
                      {t("channelSearch.orderOptions.relevance")}
                    </SelectItem>
                    <SelectItem value="date">
                      {t("channelSearch.orderOptions.date")}
                    </SelectItem>
                    <SelectItem value="rating">
                      {t("channelSearch.orderOptions.rating")}
                    </SelectItem>
                    <SelectItem value="title">
                      {t("channelSearch.orderOptions.title")}
                    </SelectItem>
                    <SelectItem value="videoCount">
                      {t("channelSearch.orderOptions.videoCount")}
                    </SelectItem>
                    <SelectItem value="viewCount">
                      {t("channelSearch.orderOptions.viewCount")}
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
                  <FormLabel>{t("channelSearch.dateFrom")}</FormLabel>
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
                            : t("channelSearch.datePlaceholder")}
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
                  <FormLabel>{t("channelSearch.dateTo")}</FormLabel>
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
                            : t("channelSearch.datePlaceholder")}
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
                {t("channelSearch.searching")}
              </>
            ) : (
              <>
                <Search className="size-4" />
                {t("channelSearch.button")}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
