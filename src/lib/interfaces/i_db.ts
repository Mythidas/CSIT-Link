export interface Company {
  company_id: number,
  title: string
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
}

export interface Device {
  device_id: number;
  site_id: number;
  hostname: string;
  os: string;
  mac: string;
  ipv4: string;
  wan: string;
}

export interface DeviceRMM {
  id: number;
  device_id: number;
  site_id: number;
  rmm_id: string;
  heartbeat: Date;
  firewall: boolean;
  uac: boolean;
}

export interface DeviceAV {
  id: number;
  device_id: number;
  site_id: number;
  av_id: string;
  heartbeat: Date;
  tamper: boolean;
  health: string;
}

export interface DeviceBU {
  id: number;
  device_id: number;
}

export interface DeviceAll {
  base: Device;
  rmm: DeviceRMM;
  av: DeviceAV;
}

export interface Patch {
  id: number,
  major: number,
  minor: number,
  build: number,
  description: string
}

export interface Auth {
  id: number,
  jwt_token: string,
  expiration: string,
  username: string,
}