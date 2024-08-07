export interface Company {
  company_id: number,
  company_title: string
}

export interface Site {
  site_id: number;
  title: string;
  psa_id: string;
  rmm_id: string;
  av_id: string;
  av_url: string;
  company_id: number;
  company_title: string;
  last_update: string;
  rmm_device_count: number;
  av_device_count: number;
}

export interface ABHistory {
  id: number;
  site_id: number;
  prev_count: number;
  new_count: number;
  psa_contract_id: number;
  psa_service_id: number;
  psa_service_desc: "CSAB_DESK" | "CSAB_SERV";
  psa_service_type: "SERVICE" | "BUNDLE";
};