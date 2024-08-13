import * as db from "$lib/server/database_v2";
import * as psa from "$lib/server/api_psa.js";
import * as rmm from "$lib/server/api_rmm.js";
import * as av from "$lib/server/api_av.js";

export async function load({ locals, cookies }) {
  try {
    const psa_sites = await psa.get_sites();
    if (!psa_sites) return "Error fetching PSA Sites";

    const rmm_sites = await rmm.get_sites();
    if (!rmm_sites) return "Error fetching RMM Sites";

    const av_sites = await av.get_sites(cookies);
    if (!av_sites) return "Error fetching AV Sites";

    const db_sites = await db.get_sites(locals.db_conn, [], [], [], { key: "", group: "", asc: true, type: "" });
    const db_companies = await db.get_companies(locals.db_conn, [], [], [], { key: "", group: "", asc: true, type: "" });

    return {
      sites: db_sites,
      companies: db_companies,
      rmm_sites: rmm_sites,
      av_sites: av_sites,
      psa_sites: psa_sites
    }
  } catch (err) {
    console.log(err);
    return {};
  }
}