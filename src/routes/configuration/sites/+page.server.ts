import * as db from "$lib/server/database";
import type APIResponse from "$lib/interfaces/api_response.js";
import { api_response_log } from "$lib/interfaces/api_response.js";

export async function load({ fetch, locals }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn);

    const psa_sites_api = await fetch("/api/psa/sites");
    const psa_sites_data = await psa_sites_api.json() as APIResponse;
    if (!psa_sites_api.ok) api_response_log(psa_sites_data);

    const rmm_sites_api = await fetch("/api/rmm/sites");
    const rmm_sites_data = await rmm_sites_api.json() as APIResponse;
    if (!rmm_sites_api.ok) api_response_log(rmm_sites_data);

    const av_sites_api = await fetch("/api/av/sites");
    const av_sites_data = await av_sites_api.json() as APIResponse;
    if (!av_sites_api.ok) api_response_log(av_sites_data);

    return {
      sites: db_sites,
      rmm_sites: rmm_sites_data.data,
      av_sites: av_sites_data.data,
      psa_sites: psa_sites_data.data
    }
  } catch (err) {
    console.log(err);
  }
}