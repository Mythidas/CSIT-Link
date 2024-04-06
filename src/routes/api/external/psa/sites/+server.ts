import { PSA_ID, PSA_SC, PSA_TR } from "$env/static/private";
import type _ExtSite from "$lib/interfaces/i_ext_site";

const psa_url = "https://webservices15.autotask.net/atservicesrest";

export async function GET() {
  try {
    let site_list: _ExtSite[] = [];

    // const site_api = await fetch(`${psa_url}/v1.0/Companies/query?search={"Filter":[{"field":"Id","op":"gte","value":0}]}`, {
    //   method: "GET",
    //   headers: {
    //     "APIIntegrationcode": PSA_TR,
    //     "UserName": PSA_ID,
    //     "Secret": PSA_SC,
    //     "Content-Type": "application/json"
    //   }
    // });

    return Response.json({ data: site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ data: [], error: { message: "Failed to get sites (PSA/Sites)" }}, { status: 500 });
  }
}