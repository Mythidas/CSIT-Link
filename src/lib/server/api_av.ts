import { dev } from '$app/environment';
import { AV_ID, AV_SC, AV_URL } from '$env/static/private';
import type { _ExtSite, _SophosDevice } from '$lib/interfaces/i_ext_info';
import { Debug } from '$lib/tools/debug';
import type { Cookies } from '@sveltejs/kit';

const debug = new Debug("api_av");

export async function get_sites(cookies: Cookies): Promise<_ExtSite[] | null> {
  try {
    const token = await get_token(cookies);
    if (!token) {
      debug.log("get_sites", "Failed to get tokens");
      return null;
    }

    let page_index = 1;
    let site_list: any[] = [];

    while (true) {
      const site_api = await fetch(`https://api.central.sophos.com/partner/v1/tenants?pageTotal=true&page=${page_index}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token[0]}`,
          "X-Partner-ID": token[1]
        }
      })
      const site_data = await site_api.json();

      if (!site_api.ok) {
        debug.log("get_sites", site_data.error);
        return null;
      }

      for (let i = 0; i < site_data.items.length; i++) {
        site_list.push({ name: site_data.items[i].name, id: site_data.items[i].id, api_url: site_data.items[i].apiHost });
      }

      if (site_data.pages.total === page_index) {
        break;
      }

      page_index++;
    }

    return site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  } catch (err) {
    debug.log("get_sites", "Failed to get tokens");
    return null;
  }
}

async function get_token(cookies: Cookies): Promise<string[] | null> {
  const jwt = cookies.get("av_jwt");
  const pwt = cookies.get("av_pwt");
  if (jwt && pwt) {
    return [ jwt, pwt ];
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
    debug.log("get_token", "Failed to get sophos token");
    return null;
  }

  const pt_api = await fetch("https://api.central.sophos.com/whoami/v1", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token_data.access_token}`
    }
  });
  const pt_data = await pt_api.json();

  if (!pt_api.ok) {
    debug.log("get_token", "Failed to get sophos partner");
    return null;
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

  return [token_data.access_token, pt_data.id];
}

export async function get_devices(av_site_id: string, av_site_url: string, cookies: Cookies): Promise<_SophosDevice[] | null> {
  try {
    const token = await get_token(cookies);
    if (!token) {
      debug.log("get_devices", "Failed to get tokens");
      return null;
    }

    const device_api = await fetch(`${av_site_url}/endpoint/v1/endpoints`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token[0]}`,
        "X-Tenant-ID": av_site_id
      }
    });
    const device_data = await device_api.json();
    
    if (!device_api.ok) {
      console.log(`[get_devices] ${device_data.error}`);
      return null;
    }
    
    return device_data.items as _SophosDevice[];
  } catch (err) {
    console.log(`[get_devices] ${err}`);
    return null;
  }
}

export async function get_tamper_status(device_id: string, av_site_id: string, av_site_url: string, cookies: Cookies): Promise<{ enabled: boolean, tp_pass: string } | null> {
  try {
    const token = await get_token(cookies);
    if (!token) {
      debug.log("get_tamper_status", "Failed to get tokens");
      return null;
    }

    const device_api = await fetch(`${av_site_url}/endpoint/v1/endpoints/${device_id}/tamper-protection`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token[0]}`,
        "X-Tenant-ID": av_site_id
      }
    });
    const device_data = await device_api.json();
    
    if (!device_api.ok) {
      debug.log("get_tamper_status", "Failed to get device info");
      return null;
    }
    
    return { enabled: device_data.enabled, tp_pass: device_data.password };
  } catch (err) {
    debug.log("get_tamper_status", err as string);
    return null;
  }
}

export async function toggle_tamper_status(tamper_state: boolean, device_id: string, av_site_id: string, av_site_url: string, cookies: Cookies): Promise<{ enabled: boolean, tp_pass: string } | null> {
  try {
    const token = await get_token(cookies);
    if (!token) {
      debug.log("toggle_tamper_status", "Failed to get tokens");
      return null;
    }

    const device_api = await fetch(`${av_site_url}/endpoint/v1/endpoints/${device_id}/tamper-protection`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token[0]}`,
        "X-Tenant-ID": av_site_id,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "enabled": tamper_state
      })
    });
    const device_data = await device_api.json();
    
    if (!device_api.ok) {
      debug.log("toggle_tamper_status", "Failed to get device info");
      return null;
    }
    
    return { enabled: device_data.enabled, tp_pass: device_data.password };
  } catch (err) {
    debug.log("toggle_tamper_status", err as string);
    return null;
  }
}

export async function delete_device_av(device_id: string, av_site_id: string, av_site_url: string, cookies: Cookies): Promise<boolean> {
  try {
    const token = await get_token(cookies);
    if (!token) {
      debug.log("delete_device_av", "Failed to get tokens");
      return false;
    }

    const tamper_state = await toggle_tamper_status(false, device_id, av_site_id, av_site_url, cookies);

    if (!tamper_state) {
      debug.log("delete_device_av", "Failed to get tamper state");
      return false;
    } else if (tamper_state.enabled) {
      debug.log("delete_device_av", "Failed to get disable tamper protection");
      return false;
    }

    const device_api = await fetch(`${av_site_url}/endpoint/v1/endpoints/${device_id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token[0]}`,
        "X-Tenant-ID": av_site_id
      }
    });
    
    if (!device_api.ok) {
      debug.log("delete_device_av", "Failed to delete device");
      return false;
    }
    
    return true;
  } catch (err) {
    debug.log("delete_device_av", err as string);
    return false;
  }
}