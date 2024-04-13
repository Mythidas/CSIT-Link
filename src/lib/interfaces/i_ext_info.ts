export interface _ExtSite {
  name: string,
  id: string,
  api_url?: string
}

export interface _ExtDevice {
  id: string,
  name: string,
  os: string,
  os_type: "Server" | "Workstation",
  ip_lan: string,
  last_heartbeat: string,
  firewall_enabled: boolean
}