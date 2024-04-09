export interface APIResponse {
  data: any,
  error?: {
    message: string,
    object?: any
  }
}

export function api_response_log(res: APIResponse) {
  if (res.error) {
    console.log(res.error.message);
    if (res.error.object) {
      console.log(res.error.object);
    }
  }
}