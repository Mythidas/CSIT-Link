import { PSA_ID, PSA_SC, PSA_TR } from "$env/static/private";
import type { _ExtSite } from '$lib/interfaces/i_ext_info.js';

const psa_url = "https://webservices15.autotask.net/atservicesrest/v1.0";

export async function GET() {
  try {
    let site_list: _ExtSite[] = [];

    const site_api = await fetch(`${psa_url}/Companies/query?search={"Filter":[{"field":"Id","op":"gte","value":0},{"field":"companyType","op":"eq","value":1},{"field":"isActive","op":"eq","value":true}]}`, {
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
      return Response.json({
        data: [],
        error: {
          message: "Failed find get sites (PSA/Sites)",
          object: site_data
        }
      }, { status: 500 });
    }

    for (let i = 0; i < site_data.items.length; i++) {
      site_list.push({ name: site_data.items[i].companyName, id: site_data.items[i].id });
    }

    return Response.json({ data: site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ data: [], error: { message: "Failed to get sites (PSA/Sites)" }}, { status: 500 });
  }
}