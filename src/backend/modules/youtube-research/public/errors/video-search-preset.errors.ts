export class VideoSearchPresetNotFoundError extends Error {
  constructor() {
    super("Video search preset not found")
    this.name = "VideoSearchPresetNotFoundError"
  }
}

export class VideoSearchPresetLimitExceededError extends Error {
  constructor() {
    super("Video search preset limit exceeded")
    this.name = "VideoSearchPresetLimitExceededError"
  }
}

export class VideoSearchPresetDuplicateNameError extends Error {
  constructor() {
    super("Video search preset with the same name already exists")
    this.name = "VideoSearchPresetDuplicateNameError"
  }
}
