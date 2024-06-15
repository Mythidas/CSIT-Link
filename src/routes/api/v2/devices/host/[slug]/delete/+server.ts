import * as db from "$lib/server/database_v2.js";

export async function DELETE({ request, locals, params, cookies }) {
  try {
    const db_device = await db.get_device(locals.db_conn, Number(params.slug));
    if (!db_device || !db_device.av_id) {
      return Response.json({
        meta: {
          error: "[API/V2/Devices/Host/[id]/Delete] Failed to find device",
          status: 500
        }
      }, { status: 500 });
    }

    const is_deleted = await db.delete_device_av(locals.db_conn, db_device.device_id, cookies);
    if (!is_deleted) {
      return Response.json({
        meta: {
          error: "Failed to delete",
          status: 500
        }
      }, { status: 500 });
    }

    return Response.json({
      meta: {
        status: 200,
      }
    }, { status: 200 });
  } catch (err) {
    console.log(`[API/V2/Devices/Host/[id]/Delete] ${err}`);
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}