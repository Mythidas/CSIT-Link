import * as db from "$lib/server/database_v2";

export async function load({ locals, cookies }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn, [], [], [], undefined);

    for (const site of db_sites) {
      if (new Date(site.last_update).getTime() - new Date().getTime() <= 3600 * 1000) {
        db.update_site_devices(locals.db_conn, site.site_id, cookies);
      }
    }

    return {
      sites: db_sites
    };
  } catch (err) {
    console.log(err);
    return {};
  }
}