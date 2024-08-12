import * as av from "$lib/server/api_av.js";
import * as db from "$lib/server/database_v2.js";

export async function DELETE({ locals, params, cookies }) {
  try {
    const sophos_id = params.id;
    const site_id = params.site_id;
    const db_site = await db.get_site(locals.db_conn, Number(site_id));
    if (!db_site) {
      console.log(`[API/V2/Sophos/:site_id/:id][DELETE] Invalid Site ID`);
      return Response.json({
        meta: {
          error: "Invalid Site ID",
          status: 500
        }
      }, { status: 500 });
    }

    const result = await av.delete_device_av(sophos_id, db_site.av_id, db_site.av_url, cookies);

    if (!result) {
      console.log(`[API/V2/Sophos/:site_id/:id][DELETE] Failed to delete Sophos Device`);
      return Response.json({
        meta: {
          error: "Failed to delete Sophos Device",
          status: 500
        }
      }, { status: 500 });
    }

    console.log(`[API/V2/Sophos/:site_id/:id][DELETE] Deleted Device ${sophos_id}`);
    return Response.json({
      data: "Device Deleted",
      meta: {
        status: 200,
      }
    }, { status: 200 });
  } catch (err) {
    console.log(`[API/V2/Sophos/:site_id/:id][DELETE] ${err}`);
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}