import { RMM_ID, RMM_SC, RMM_URL } from "$env/static/private";
import type { APIResponse } from "$lib/interfaces/i_api_response";
import type { Device, DeviceRMM } from "$lib/interfaces/i_db";

const rmm_auth = btoa(`${RMM_ID}:${RMM_SC}`);

export async function get_sites(): Promise<APIResponse> {
  let site_list: any[] = [];

  try {
    while (true) {
      const site_api = await fetch(`${RMM_URL}/sites?&$skip=${site_list.length}`, {
        method: "GET",
        headers: {
          "authorization": `Basic ${rmm_auth}`,
          "content-type": "application/json"
        }
      });
      const site_data = await site_api.json();

      if (!site_api.ok) {
        return { meta: { error: site_data, status: 500 }};
      }

      for (let i = 0; i < site_data.Data.length; i++) {
        let site_name = site_data.Data[i].Name;
        site_list.push({ name: site_name, id: site_data.Data[i].Id });
      }

      if (site_list.length >= site_data.Meta.TotalCount) {
        break;
      }
    }
  } catch (err) {
    console.log(err);
    return { meta: { error: err, status: 500 }}
  }

  return { data: site_list, meta: { status: 200 }};
}

export async function get_devices(rmm_site_id: string): Promise<APIResponse> {
  try {
    let device_list: Device[] = [];
    let rmm_list: DeviceRMM[] = [];

    const asset_api = await fetch(`${RMM_URL}/assets?$filter=SiteId eq ${rmm_site_id}`, {
      method: "GET",
      headers: {
        "authorization": `Basic ${rmm_auth}`,
        "content-type": "application/json"
      }
    });
    const asset_data = await asset_api.json();

    if (!asset_api.ok) {
      return { meta: { error: asset_data.Meta, status: 500 }};
    }

    const device_data = asset_data.Data;
    for (let i = 0; i < device_data.length; i++) {
      device_list.push({ 
        device_id: -1,
        site_id: -1,
        hostname: device_data[i].Name,
        os: device_data[i].Description,
        ipv4: device_data[i].IpAddresses[0]?.ips[0]?.ip || "",
        mac: device_data[i].IpAddresses[0]?.mac || "",
        wan: device_data[i].PublicIpAddress
      });

      rmm_list.push({
        id: -1,
        device_id: -1,
        site_id: -1,
        rmm_id: device_data[i].Identifier,
        heartbeat_rmm: device_data[i].LastSeenOnline,
        firewall: device_data[i].FirewallEnabled,
        uac: device_data[i].UacEnabled,
        memory: convert_bytes_to_gbytes(device_data[i].MemoryTotal)
      });
    }

    return { data: { device_list, rmm_list }, meta: { status: 200 }};
  } catch (err) {
    console.log(err);
    return { meta: { error: err, status: 501 }};
  }
}

export async function get_devices_all(): Promise<APIResponse> {
  try {
    let device_list: Device[] = [];
    let rmm_list: DeviceRMM[] = [];
    let total = 200;

    while (rmm_list.length < total) {
      const asset_api = await fetch(`${RMM_URL}/assets?$skip=${rmm_list.length}`, {
        method: "GET",
        headers: {
          "authorization": `Basic ${rmm_auth}`,
          "content-type": "application/json"
        }
      });
      const asset_data = await asset_api.json();

      if (!asset_api.ok) {
        return { meta: { error: asset_data.Meta, status: 500 }};
      }

      const device_data = asset_data.Data;
      for (let i = 0; i < device_data.length; i++) {
        let ipv4;
        for (let j = 0; j < device_data[i].IpAddresses.length; j++) {
          for (let k = 0; k < device_data[i]?.IpAddresses[j].length; k++) {
            if (device_data[i]?.IpAddresses[j].ip) {
              ipv4 = device_data[i]?.IpAddresses[j].ip;
            }
          }

          if (ipv4) break;
        }

        device_list.push({ 
          device_id: -1,
          site_id: device_data[i].SiteId || 0,
          hostname: device_data[i].Name || "",
          os: device_data[i].Description || "",
          ipv4,
          mac: "",
          wan: device_data[i].PublicIpAddress || ""
        });

        rmm_list.push({
          id: -1,
          device_id: -1,
          site_id: device_data[i].SiteId || 0,
          rmm_id: device_data[i].Identifier || "",
          heartbeat_rmm: device_data[i].LastSeenOnline || "",
          firewall: device_data[i].FirewallEnabled || false,
          uac: device_data[i].UacEnabled || false,
          memory: convert_bytes_to_gbytes(device_data[i].MemoryTotal || 0)
        });
      }
        
      total = asset_data.Meta.TotalCount;
      console.log(`Obtained ${device_list.length} rmm devices...`);
    }

    return { data: { device_list, rmm_list }, meta: { status: 200 }};
  } catch (err) {
    console.log(err);
    return { meta: { error: err, status: 501 }};
  }
}

function convert_bytes_to_gbytes(bytes: number) {
  const GIGABYTE = Math.pow(1024, 3);
  const gigabytes = bytes / GIGABYTE;
  return Math.floor(gigabytes * 1024);
}