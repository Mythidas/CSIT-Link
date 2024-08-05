import { RMM_ID, RMM_SC, RMM_URL } from "$env/static/private";
import type { _ExtSite, _VSAxDevice } from "$lib/interfaces/i_ext_info";
import { Debug } from '$lib/tools/debug';

const rmm_auth = btoa(`${RMM_ID}:${RMM_SC}`);
const debug = new Debug("api_rmm");

export async function get_sites(): Promise<_ExtSite[] | null> {
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
        debug.log("get_sites", "Failed to get sites");
        null;
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
    debug.log("get_sites", err as string);
    return null;
  }

  return site_list;
}

// export async function get_groups(rmm_site_id: string) {
//   try {
//     const asset_api = await fetch(`${RMM_URL}/groups?$filter=ParentSiteId eq ${rmm_site_id}`, {
//       method: "GET",
//       headers: {
//         "authorization": `Basic ${rmm_auth}`,
//         "content-type": "application/json"
//       }
//     });
//     const asset_data = await asset_api.json();
    
//     if (!asset_api.ok) {
//       console.log(`[get_groups] ${asset_data.ExceptionMessage}`);
//       return { meta: { error: asset_data.ExceptionMessage, status: 500 }};
//     }
    
//     return { data: asset_data.Data, meta: { status: 200 }};
//   } catch (err) {
//     console.log(`[get_groups] ${err}`);
//     return { meta: { error: err, status: 500 }};
//   }
// }

export async function get_devices(rmm_site_id: string): Promise<_VSAxDevice[] | null> {
  try {
    const asset_api = await fetch(`${RMM_URL}/assets?$filter=SiteId eq ${rmm_site_id}`, {
      method: "GET",
      headers: {
        "authorization": `Basic ${rmm_auth}`,
        "content-type": "application/json"
      }
    });
    const asset_data = await asset_api.json();

    if (!asset_api.ok) {
      console.log(`[get_devices] ${asset_data.Meta}`);
      return null;
    }

    return asset_data.Data as _VSAxDevice[];
  } catch (err) {
    console.log(`[get_devices] ${err}`);
    return null;
  }
}

function convert_bytes_to_gbytes(bytes: number) {
  const GIGABYTE = Math.pow(1024, 3);
  const gigabytes = bytes / GIGABYTE;
  return Math.floor(gigabytes * 1024);
}