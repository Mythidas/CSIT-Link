import type _ExtSite from '$lib/interfaces/i_ext_site.js';

export async function GET({ cookies, fetch }) {
  try {
    const token_validate = await fetch("/api/external/av/token");
    if (token_validate.ok) {
      const jwt = cookies.get("av_jwt_token");
      const pt = cookies.get("av_pt_token");

      if (!jwt || !pt) return Response.json({ data: [], error: { message: "Failed to get tokens (AV/Sites)"}}, { status: 500 });

      let page_index = 1;
      let site_list: _ExtSite[] = [];
      while (site_list.length < 300) {
        const site_api = await fetch(`https://api.central.sophos.com/partner/v1/tenants?pageTotal=true&page=${page_index}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwt}`,
            "X-Partner-ID": pt
          }
        })
        const site_data = await site_api.json();

        if (!site_api.ok) {
          return Response.json({
            data: [],
            error: {
              message: "Failed to get sites (AV/Sites)",
              object: site_data
            }
          }, { status: 500 })
        }

        for (let i = 0; i < site_data.items.length; i++) {
          site_list.push({ name: site_data.items[i].name, id: site_data.items[i].id, api_url: site_data.items[i].apiHost });
        }

        if (site_data.pages.total === page_index) {
          break;
        }

        page_index++;
      }

      return Response.json({ data: site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) }, { status: 200 });
    } else {
      return Response.json({ data: [], error: { message: "Failed to validate tokens (AV/Site)" }}, { status: 500 });
    }
  } catch {
    return Response.json({ data: [], error: { message: "Failed to get sites (AV/Sites)" }}, { status: 500 });
  }
}