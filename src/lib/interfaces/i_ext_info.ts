export interface _ExtSite {
  name: string,
  id: string,
  api_url?: string
}

export interface _ExtDevice {
  name: string,
  id: string,
  os: "Server" | "Workstation"
}