import { dev } from '$app/environment';
import { AV_ID, AV_SC, AV_URL } from '$env/static/private';
import type { APIResponse } from '$lib/interfaces/i_api_response';
import type { Device, DeviceAV } from '$lib/interfaces/i_db';
import type { Cookies } from '@sveltejs/kit';

export async function get_sites(cookies: Cookies): Promise<APIResponse> {
  try {
    const token = await get_token(cookies);
    if (token.meta.status !== 200) {
      return { meta: { error: "Failed to get tokens", status: 500 }};
    }

    let page_index = 1;
    let site_list: any[] = [];

    while (true) {
      const site_api = await fetch(`https://api.central.sophos.com/partner/v1/tenants?pageTotal=true&page=${page_index}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token.data[0]}`,
          "X-Partner-ID": token.data[1]
        }
      })
      const site_data = await site_api.json();

      if (!site_api.ok) {
        return { meta: { error: site_data, status: 500 }};
      }

      for (let i = 0; i < site_data.items.length; i++) {
        site_list.push({ name: site_data.items[i].name, id: site_data.items[i].id, api_url: site_data.items[i].apiHost });
      }

      if (site_data.pages.total === page_index) {
        break;
      }

      page_index++;
    }

    return { data: site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())), meta: { status: 200 }};
  } catch {
    return { meta: { error: "Failed to get sites", status: 500 }};
  }
}

async function get_token(cookies: Cookies): Promise<APIResponse> {
  const jwt = cookies.get("av_jwt");
  const pwt = cookies.get("av_pwt");
  if (jwt && pwt) {
    return { data: [ jwt, pwt ], meta: { status: 200 }};
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: AV_ID,
    client_secret: AV_SC,
    scope: 'token'
  });

  const token_api = await fetch(`${AV_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });
  const token_data = await token_api.json();
  
  if (!token_api.ok) {
    return { meta: { error: token_data, status: 500 }};
  }

  const pt_api = await fetch("https://api.central.sophos.com/whoami/v1", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token_data.access_token}`
    }
  });
  const pt_data = await pt_api.json();

  if (!pt_api.ok) {
    return { meta: { error: pt_data, status: 500 }};
  }

  cookies.set("av_pwt", pt_data.id, {
    path: "/",
    maxAge: 3600,
    httpOnly: true,
    secure: !dev,
    sameSite: "strict"
  });

  cookies.set("av_jwt", token_data.access_token, {
    path: "/",
    maxAge: 3600,
    httpOnly: true,
    secure: !dev,
    sameSite: "strict"
  });

  return { data: [ token_data.access_token, pt_data.id ], meta: { status: 200 }};
}

export async function get_devices(av_site_id: string, av_site_url: string, cookies: Cookies): Promise<APIResponse> {
  try {
    const token = await get_token(cookies);
    if (token.meta.status !== 200) {
      return { meta: { error: "Failed to get tokens", status: 500 }};
    }

    const device_api = await fetch(`${av_site_url}/endpoint/v1/endpoints`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token.data[0]}`,
        "X-Tenant-ID": av_site_id
      }
    });
    const device_data = await device_api.json();
    
    if (!device_api.ok) {
      return { meta: { error: device_data, status: 500 }};
    }
    
    let device_list: Device[] = [];
    let av_list: DeviceAV[] = [];
    if (device_data.items) {
      for (let i = 0; i < device_data.items.length; i++) {
        device_list.push({ 
          device_id: device_data.items[i].id,
          site_id: -1,
          hostname: device_data.items[i].hostname,
          os: device_data.items[i].os.name, 
          mac: device_data.items[i].macAddresses[0] || "",
          ipv4: device_data.items[i].ipv4Addresses[0] || "",
          wan: ""
        });

        av_list.push({
          id: -1,
          device_id: -1,
          site_id: -1,
          av_id: device_data.items[0].id,
          heartbeat: device_data.items[i].lastSeenAt,
          tamper: device_data.items[i].tamperProtectionEnabled,
          health: device_data.items[i].health.overall
        });
      }
    }
    
    return { data: { device_list, av_list }, meta: { status: 200 }};
  } catch (err) {
    return { meta: { error: err, status: 501 }};
  }
}