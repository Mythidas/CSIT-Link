import * as db from "$lib/server/database";

export async function load({ locals, url }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn);

    return {
      sites: db_sites
    }
  } catch (err) {
    console.log(err);
  }
}