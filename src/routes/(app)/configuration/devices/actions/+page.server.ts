import * as db from "$lib/server/database_v2";
import * as rmm from "$lib/server/api_rmm.js";

export async function load({ locals }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn, [], [], [], { type: "", group: "", asc: true, key: ""});

    return {
      sites: db_sites,
    }
  } catch (err) {
    console.log(err);
  }
}