import type { Site } from "$lib/interfaces/i_db.js";
import * as db from "$lib/server/database_v2.js";

export async function POST({ request, locals }) {
  try {
    let req_site = await request.json() as Site;
    const find_site = await db.get_site(locals.db_conn, req_site.site_id);

    if (find_site) {
      const db_res = await db.update_site(locals.db_conn, req_site);
      if (!db_res) {
        console.log(`[API/V2/Sites][Post] Failed to update site`);
        return Response.json({
          meta: {
            error: "[API/V2/Sites][Post] Failed to update site",
            status: 500
          }
        }, { status: 500 });
      }
    } else {
      const db_site = await db.add_site(locals.db_conn, req_site);
      if (!db_site) {
        console.log(`[API/V2/Sites][Post] Failed to create site`);
        return Response.json({
          meta: {
            error: "[API/V2/Sites][Post] Failed to create site",
            status: 500
          }
        }, { status: 500 });
      }

      req_site = {...db_site};
    }

    return Response.json({
      data: req_site,
      meta: {
        status: 200
      }
    }, { status: 200 });
  } catch (err) {
    console.log(`[API/V2/Sites][Post] ${err}`);
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}