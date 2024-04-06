import { RMM_ID, RMM_SC } from "$env/static/private";
import type _ExtSite from "$lib/interfaces/i_ext_site";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${RMM_ID}:${RMM_SC}`);

export async function GET() {
  try {
    let site_list: _ExtSite[] = [];
    while (site_list.length < 500) {
      const site_api = await fetch(`${vsa_url}/api/v3/sites?&$skip=${site_list.length}`, {
        method: "GET",
        headers: {
          "authorization": `Basic ${vsa_auth}`,
          "content-type": "application/json"
        }
      });
      const site_data = await site_api.json();

      if (!site_api.ok) {
        return Response.json({
          data: [],
          error: {
            message: "Failed to get sites (RMM/Sites)",
            object: site_data
          }
        }, { status: 500 });
      }

      for (let i = 0; i < site_data.Data.length; i++) {
        let site_name = site_data.Data[i].Name;
        if (site_name.toLowerCase().localeCompare(site_data.Data[i].ParentName.toLowerCase())) {
          site_name = site_data.Data[i].ParentName + " - " + site_name;
        }

        site_list.push({ name: site_name, id: site_data.Data[i].Id });
      }

      if (site_list.length >= site_data.Meta.TotalCount) {
        break;
      }
    }

    return Response.json({ data: site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) }, { status: 200 });
  } catch {
    return Response.json({ data: [],  error: { message: "Failed to get sites (RMM/Sites)" }}, { status: 500 });
  }
}