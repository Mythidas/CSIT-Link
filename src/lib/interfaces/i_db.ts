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
  os: string,
  psa_id: string,
  rmm_id: string,
  av_id: string
}