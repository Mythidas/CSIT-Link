import * as db from "$lib/server/database";
import type { APIResponse } from "$lib/interfaces/i_api_response.js";
import { api_response_log } from "$lib/interfaces/i_api_response.js";
import type { Actions } from "./$types.js";
import type { Site } from "$lib/interfaces/i_db.js";

export async function load({ fetch, locals }) {
  try {
    const db_companies = await db.get_companies(locals.db_conn);

    const psa_sites_api = await fetch("/api/external/psa/sites");
    const psa_sites_data = await psa_sites_api.json() as APIResponse;
    if (!psa_sites_api.ok) api_response_log(psa_sites_data);

    const rmm_sites_api = await fetch("/api/external/rmm/sites");
    const rmm_sites_data = await rmm_sites_api.json() as APIResponse;
    if (!rmm_sites_api.ok) api_response_log(rmm_sites_data);

    const av_sites_api = await fetch("/api/external/av/sites");
    const av_sites_data = await av_sites_api.json() as APIResponse;
    if (!av_sites_api.ok) api_response_log(av_sites_data);

    return {
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

    if (site_data.title === "" || site_data.psa_id === "" || site_data.rmm_id === "" || site_data.av_id === "" || site_data.av_url === "") {
      return "Invalid Data";
    }

    if ((await db.add_site(event.locals.db_conn, site_data)).length > 0) {
      return "Site Added";
    } else {
      return "Error adding site";
    }
  }
} satisfies Actions;