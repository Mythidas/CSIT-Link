import { PSA_ID, PSA_SC, PSA_TR, PSA_URL } from "$env/static/private";
import type { APIResponse } from "$lib/interfaces/i_api_response";

export async function get_sites(): Promise<APIResponse> {
  let site_list: any[] = [];

  try {
    const site_api = await fetch(`${PSA_URL}/Companies/query?search={"Filter":[{"field":"Id","op":"gte","value":0},{"field":"companyType","op":"eq","value":1},{"field":"isActive","op":"eq","value":true}]}`, {
      method: "GET",
      headers: {
        "APIIntegrationcode": PSA_TR,
        "UserName": PSA_ID,
        "Secret": PSA_SC,
        "Content-Type": "application/json"
      }
    });
    const site_data = await site_api.json();

    if (!site_api.ok) {
      return { meta: { error: site_data, status: 500 }};
    }

    for (let i = 0; i < site_data.items.length; i++) {
      site_list.push({ name: site_data.items[i].companyName, id: site_data.items[i].id });
    }
  } catch (err) {
    console.log(err);
    return { meta: { error: err, status: 500 } };
  }

  return { data: site_list, meta: { status: 200 }};
}