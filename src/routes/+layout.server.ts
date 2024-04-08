import * as db from "$lib/server/database";

export async function load({ locals, url }) {
  try {
    let site_id = -1;
    let path_split = url.pathname.split("/");
    
    if (path_split[1] === "sites" && path_split.length > 2) {
      site_id = Number(path_split[path_split.length - 1]);
    }

    const db_site = await db.get_site(locals.db_conn, site_id);

    return {
      site: db_site
    }
  } catch (err) {
    console.log(err);
  }
}