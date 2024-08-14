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
  SophosID?: string; // Used to store Sophos ID Custom Field
}

export interface _SophosDevice {
  id: string;
  type: string;
  tenant: {
    id: string;
  };
  hostname: string;
  health: {
    overall: string;
    threats: {
      status: string;
    };
    services: {
      status: string;
      serviceDetails:   
 any[]; // Replace any with appropriate type if known
    };
  };
  os: {
    isServer: boolean;
    platform: string;
    name: string;
    majorVersion: number;
    minorVersion: number;
    build: number;
  };
  ipv4Addresses: string[];
  macAddresses: string[];
  associatedPerson: {
    name: string;
    viaLogin: string;
    id: string;
  };
  tamperProtectionEnabled: boolean;
  assignedProducts:   
 {
    code: string;
    version: string;
    status:   
 string;
  }[];
  lastSeenAt: string; // Assuming a date/time string, consider using Date
  isolation: {
    status: string;
    adminIsolated: boolean;
    selfIsolated: boolean;
  };
}

export interface _SophosDeviceEXT extends _SophosDevice {
  title: string;
  site_id: number;
  tamper_info?: { enabled: boolean, password: string }
}

export interface _PSAContractInfo {
  units: number;
  psa_contract_id: number;
  psa_service_id: number;
  psa_service_type: "SERVICE" | "BUNDLE";
  psa_service_desc: "CSAB_DESK" | "CSAB_SERV";
  change?: number;
}