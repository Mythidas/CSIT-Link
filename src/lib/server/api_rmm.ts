import { RMM_ID, RMM_SC, RMM_URL } from "$env/static/private";
import type { APIResponse } from "$lib/interfaces/i_api_response";

const rmm_auth = btoa(`${RMM_ID}:${RMM_SC}`);

export async function get_sites(): Promise<APIResponse> {
  let site_list: any[] = [];

  try {
    while (true) {
      const site_api = await fetch(`${RMM_URL}/api/v3/sites?&$skip=${site_list.length}`, {
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