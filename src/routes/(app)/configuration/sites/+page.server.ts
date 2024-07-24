import * as db from "$lib/server/database_v2";
import * as psa from "$lib/server/api_psa.js";
import * as rmm from "$lib/server/api_rmm.js";
import * as av from "$lib/server/api_av.js";
import type { Site } from "$lib/interfaces/i_db.js";
import type { Actions } from "@sveltejs/kit";

export async function load({ locals, cookies }) {
  try {
    const psa_sites = await psa.get_sites();
    if (psa_sites.meta.status !== 200) return "Error fetching PSA Sites";

    const rmm_sites = await rmm.get_sites();
    if (psa_sites.meta.status !== 200) return "Error fetching RMM Sites";

    const av_sites = await av.get_sites(cookies);
    if (av_sites.meta.status !== 200) return "Error fetching AV Sites";

    const db_sites = await db.get_sites(locals.db_conn, [], [], [], { key: "", group: "", asc: true, type: "" });
    const db_companies = await db.get_companies(locals.db_conn, [], [], [], { key: "", group: "", asc: true, type: "" });

    return {
      sites: db_sites,
      companies: db_companies,
      rmm_sites: rmm_sites.data,
      av_sites: av_sites.data,
      psa_sites: psa_sites.data
    }
  } catch (err) {
    console.log(err);
    return {};
  }
}

export const actions = {
  default: async (event) => {
    const form_data = await event.request.formData();

    const psa = form_data.get("psa")?.toString();
    const rmm = form_data.get("rmm")?.toString();
    const av = form_data.get("av")?.toString().split("|") || [];

    const site_data: Site = {
      site_id: 0,
      company_title: "",
      title: form_data.get("title")?.toString() || "",
      company_id: Number(form_data.get("company_id")?.toString()) || -1,
      psa_id: psa || "",
      rmm_id: rmm || "",
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