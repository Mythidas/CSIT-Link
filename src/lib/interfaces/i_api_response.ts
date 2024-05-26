export interface APIResponse {
  data?: any;
  meta: {
    total?: any;
    error?: any;
    status: number;
  }
}