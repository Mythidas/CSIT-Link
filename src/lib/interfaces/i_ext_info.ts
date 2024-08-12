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

export interface _VSAxDevice {
  Identifier: string;
  Name: string;
  Description: string; // os
  LastSeenOnline: string;
  FirewallEnabled: boolean;
  UacEnabled: boolean;
  MemoryTotal: number;
}

export interface _SophosDevice {
  id: string;
  hostname: string;
  os: { isServer: boolean, name: string };
  lastSeenAt: string;
  tamperProtectionEnabled: boolean;
  health: { overall: string };
}

export interface _SophosDeviceEXT extends _SophosDevice {
  title: string;
  site_id: number;
}

export interface _PSAContractInfo {
  units: number;
  psa_contract_id: number;
  psa_service_id: number;
  psa_service_type: "SERVICE" | "BUNDLE";
  psa_service_desc: "CSAB_DESK" | "CSAB_SERV";
  change?: number;
}