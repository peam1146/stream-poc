export interface CreateStreamInputResponse {
  uid: string
  rtmps: Rtmps
  created: string
  modified: string
  meta: Meta
  recording: Recording
}

export interface Rtmps {
  url: string
  streamKey: string
}

export interface Meta {
  name: string
}

export interface Recording {
  mode: string
  requireSignedURLs: boolean
}

export interface CloudflareStreamResponse {
  result: Result[]
}

export interface Result {
  uid: string
  thumbnail: string
  status: Status
  meta: Meta
  created: string
  modified: string
  size: number
  preview: string
  playback: Playback
}

export interface Status {
  state: string
  errorReasonCode: string
  errorReasonText: string
}

export interface Meta {
  name: string
}

export interface Playback {
  hls: string
  dash: string
}

