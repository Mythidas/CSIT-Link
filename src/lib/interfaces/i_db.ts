export interface Company {
  company_id: number,
  title: string
}

export interface Site {
  site_id: number,
  title: string,
  psa_id: string,
  rmm_id: string,
  av_id: string,
  av_url: string,
  company_id: number,
  last_update: string
}

export interface Device {
  id: number,
  title: string,
  site_id: number,
  rmm_id: string,
  av_id: string,
  rmm_last_heartbeat: string,
  av_last_heartbeat: string,
  os_type: "Workstation" | "Server",
  os: string,
  ip_lan: string,
  firewall_enabled: boolean,
  tamp_prot_enabled: boolean
}

export interface Patch {
  id: number,
  major: number,
  minor: number,
  build: number,
  description: string
}