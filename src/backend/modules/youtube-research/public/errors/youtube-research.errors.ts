export class YouTubeApiRequestFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "YouTube API request failed")
    this.name = "YouTubeApiRequestFailedError"
  }
}
