// --- search.list レスポンス ---

export type YouTubeSearchResult = {
  kind: string
  etag: string
  id: {
    kind: string
    videoId?: string
    channelId?: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: YouTubeThumbnail
      medium: YouTubeThumbnail
      high: YouTubeThumbnail
    }
    channelTitle: string
    liveBroadcastContent: string
  }
}

export type YouTubeSearchListResponse = {
  kind: string
  etag: string
  nextPageToken?: string
  prevPageToken?: string
  regionCode?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeSearchResult[]
}

// --- videos.list レスポンス ---

export type YouTubeVideo = {
  kind: string
  etag: string
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: YouTubeThumbnail
      medium: YouTubeThumbnail
      high: YouTubeThumbnail
    }
    channelTitle: string
    categoryId: string
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
  contentDetails: {
    duration: string
    dimension: string
    definition: string
    caption: string
  }
}

export type YouTubeVideoListResponse = {
  kind: string
  etag: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeVideo[]
}

// --- channels.list レスポンス ---

export type YouTubeChannel = {
  kind: string
  etag: string
  id: string
  snippet: {
    title: string
    description: string
    customUrl?: string
    publishedAt: string
    thumbnails: {
      default: YouTubeThumbnail
      medium: YouTubeThumbnail
      high: YouTubeThumbnail
    }
    country?: string
  }
  statistics: {
    viewCount: string
    subscriberCount: string
    hiddenSubscriberCount: boolean
    videoCount: string
  }
}

export type YouTubeChannelListResponse = {
  kind: string
  etag: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeChannel[]
}

// --- videoCategories.list レスポンス ---

export type YouTubeVideoCategory = {
  kind: string
  etag: string
  id: string
  snippet: {
    channelId: string
    title: string
    assignable: boolean
  }
}

export type YouTubeVideoCategoryListResponse = {
  kind: string
  etag: string
  items: YouTubeVideoCategory[]
}

// --- 共通型 ---

export type YouTubeThumbnail = {
  url: string
  width: number
  height: number
}

// --- 検索パラメータ定数・型 ---

export const VIDEO_DURATION_VALUES = ["any", "short", "medium", "long"] as const
export type VideoDuration = (typeof VIDEO_DURATION_VALUES)[number]

export const VIDEO_SEARCH_ORDER_VALUES = [
  "relevance",
  "date",
  "rating",
  "title",
  "viewCount"
] as const
export type VideoSearchOrder = (typeof VIDEO_SEARCH_ORDER_VALUES)[number]

export const CHANNEL_SEARCH_ORDER_VALUES = [
  "relevance",
  "date",
  "rating",
  "title",
  "videoCount",
  "viewCount"
] as const
export type ChannelSearchOrder = (typeof CHANNEL_SEARCH_ORDER_VALUES)[number]

// --- 検索パラメータ型 ---

export type YouTubeVideoSearchParams = {
  q?: string
  regionCode?: string
  relevanceLanguage?: string
  publishedAfter: string
  publishedBefore?: string
  videoCategoryId?: string
  videoDuration?: VideoDuration
  maxResults?: number
  pageToken?: string
  order?: VideoSearchOrder
}

export type YouTubeChannelSearchParams = {
  q?: string
  regionCode?: string
  relevanceLanguage?: string
  publishedAfter?: string
  publishedBefore?: string
  maxResults?: number
  pageToken?: string
  order?: ChannelSearchOrder
}
