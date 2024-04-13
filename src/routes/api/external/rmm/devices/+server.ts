import { RMM_ID, RMM_SC } from "$env/static/private";
import type { _ExtDevice } from "$lib/interfaces/i_ext_info";

const rmm_url = "https://centriserve-it.vsax.net/api/v3";
const rmm_auth = btoa(`${RMM_ID}:${RMM_SC}`);

export async function GET({ request }) {
  try {
    let device_list: _ExtDevice[] = [];
    const site_id = request.headers.get("site-id");
    if (!site_id) {
      return Response.json({ data: [], error: { message: "Invalid headers (RMM/Devices)"}}, { status: 400 }); 
    }

    const asset_api = await fetch(`${rmm_url}/assets?$filter=SiteId eq ${site_id}`, {
      method: "GET",
      headers: {
        "authorization": `Basic ${rmm_auth}`,
        "content-type": "application/json"
      }
    });
    const asset_data = await asset_api.json();

    if (!asset_api.ok) {
      return Response.json({ data: [], error: { message: "RMM failed to return devices (RMM/Devices)", object: asset_data }}, { status: 500 });
    }

    const device_data = asset_data.Data;
    for (let i = 0; i < device_data.length; i++) {
      device_list.push({ 
        id: device_data[i].Identifier,
        name: device_data[i].Name, 
        os: device_data[i].Description,
        os_type: device_data[i].GroupName.toLowerCase().includes("server") ? "Server" : "Workstation",
        ip_lan: device_data[i].IpAddresses[0] || "",
        last_heartbeat: device_data[i].LastSeenOnline,
        firewall_enabled: device_data[i].FirewallEnabled
      });
    }

    return Response.json({ data: device_list }, { status: 200 });
  } catch {
    return Response.json({ data: [], error: { message: "Failed to get devices (RMM/Devices)"}}, { status: 500 }); 
  }
}