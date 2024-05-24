export interface APIResponse {
  data: any,
  error?: {
    message: string,
    object?: any
  }
}