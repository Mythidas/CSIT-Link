import type { _ExtDevice } from "$lib/interfaces/i_ext_info";

export async function GET({ request, cookies, fetch }) {
  try {
    const token_validate = await fetch("/api/external/av/token");
    if (token_validate.ok) {
      const jwt = cookies.get("av_jwt_token");
      const av_id = request.headers.get("site-id");
      const av_url = request.headers.get("site-url");

      if (!av_id || !av_url) {
        return Response.json({ data: [], error: { message: "Invalid headers (AV/Devices)"}}, { status: 400 }); 
      }

      const device_api = await fetch(`${av_url}/endpoint/v1/endpoints`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "X-Tenant-ID": av_id
        }
      });
      const device_data = await device_api.json();
      
      if (!device_api.ok) {
        return Response.json({ 
          data: [],
          error: { 
            message: "Sophos Endpoint failure (AV/Devices)",
            object: device_data
          } 
        }, { status: 500 });
      }
      
      let device_list: _ExtDevice[] = [];
      if (device_data.items) {
        for (let i = 0; i < device_data.items.length; i++) {
          const device_type = device_data.items[i].type === "server" ? "Server" : "Workstation";
          const os = device_data.items[i].os.name;
          device_list.push({ 
            id: device_data.items[i].id,
            name: device_data.items[i].hostname, 
            os: os, 
            os_type: device_type,
            ip_lan: device_data.items[i].ipv4Addresses[0],
            last_heartbeat: device_data.items[i].lastSeenAt,
            firewall_enabled: device_data.items[i].tamperProtectionEnabled 
          });
        }
      }
      
      return Response.json({ data: device_list }, { status: 200 });
    }
    else {
      return Response.json({ error: { code: "INV_SOP_TOK", message: "Token was not found" } }, { status: 500 });
    }
  } catch {
    return Response.json({ data: [], error: { message: "Failed to get devices (AV/Devices)"}}, { status: 500 }); 
  }
}