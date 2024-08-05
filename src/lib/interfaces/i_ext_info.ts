export interface _ExtSite {
  name: string,
  id: string,
  api_url?: string
}

export interface _GroupRMM {
  Id: number,
  Name: string,
  ParentSiteId: number
}

export interface _PSAContractInfo {
  units: number;
  psa_contract_id: number;
  psa_service_id: number;
  psa_service_type: "SERVICE" | "BUNDLE";
  psa_service_desc: "CSAB_DESK" | "CSAB_SERV";
  change?: number;
}