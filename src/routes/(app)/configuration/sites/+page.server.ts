import * as db from "$lib/server/database_v2";
import type { Site } from "$lib/interfaces/i_db.js";
import type { Actions } from "@sveltejs/kit";

export async function load({ fetch, locals }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn);
    const db_companies = await db.get_companies(locals.db_conn);

    const psa_sites_api = await fetch("/api/external/psa/sites");
    const psa_sites_data = await psa_sites_api.json();
    if (!psa_sites_api.ok) return "Error fetching PSA Sites";

    const rmm_sites_api = await fetch("/api/external/rmm/sites");
    const rmm_sites_data = await rmm_sites_api.json();
    if (!rmm_sites_api.ok) return "Error fetching RMM Sites";

    const av_sites_api = await fetch("/api/external/av/sites");
    const av_sites_data = await av_sites_api.json();
    if (!av_sites_api.ok) return "Error fetching AV Sites";

    return {
      sites: db_sites,
      companies: db_companies,
      rmm_sites: rmm_sites_data.data,
      av_sites: av_sites_data.data,
      psa_sites: psa_sites_data.data
    }
  } catch (err) {
    console.log(err);
    return {};
  }
}

export const actions = {
  default: async (event) => {
    const form_data = await event.request.formData();

    const psa = form_data.get("psa")?.toString().split("|") || [];
    const rmm = form_data.get("rmm")?.toString().split("|") || [];
    const av = form_data.get("av")?.toString().split("|") || [];

    const site_data: Site = {
      site_id: 0,
      title: form_data.get("title")?.toString() || "",
      company_id: Number(form_data.get("company_id")?.toString()) || -1,
      psa_id: psa[0] || "",
      rmm_id: rmm[0] || "",
      av_id: av[0] || "",
      av_url: av[1] || "",
      last_update: ""
    }

    if (site_data.title === "" || site_data.psa_id === "") {
      return "Invalid Data";
    }

    if ((await db.add_site(event.locals.db_conn, site_data))) {
      return "Site Added";
    } else {
      return "Error adding site";
    }
  }
} satisfies Actions;