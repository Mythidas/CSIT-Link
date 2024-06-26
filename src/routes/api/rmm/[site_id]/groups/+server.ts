import * as rmm from "$lib/server/api_rmm.js";
import * as db from "$lib/server/database_v2.js";

export async function GET({ locals, params }) {
  try {
    const site = await db.get_site(locals.db_conn, Number(params.site_id || -1));
    if (!site) {
      console.log(`[API/RMM/:site_id/Groups] Failed to find site ${params.site_id}`);
      return Response.json({
        meta: {
          error: `Failed to find site ${params.site_id}`,
          status: 500
        }
      }, { status: 500 });
    }

    const groups = await rmm.get_groups(params.site_id);
    if (groups.meta.status !== 200) {
      console.log(`[API/RMM/:site_id/Groups] Failed to get groups for site ${params.site_id}`);
      return Response.json({
        meta: {
          error: groups.meta.error,
          status: 500
        }
      }, { status: 500 });
    }

    return Response.json({
      data: groups.data,
      meta: {
        status: 200,
      }
    }, { status: 200 });
  } catch (err) {
    console.log(`[API/RMM/:site_id/Groups] ${err}`);
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}