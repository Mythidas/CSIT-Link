export interface APIResponse {
  data?: any;
  meta: {
    total?: number;
    error?: any;
    status: number;
  }
}