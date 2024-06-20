import * as db from "$lib/server/database_v2.js";

export async function DELETE({ request, locals, cookies }) {
  try {
    let columns = ["dv.heartbeat_av"], values = [`<= ${new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString()}`], types = ["Date"];

    const devices = await db.get_devices(locals.db_conn, columns, values, types, { key: "", group: "", asc: true, type: "" });

    for await (const device of devices) {
      const db_site = await db.get_site(locals.db_conn, device.site_id);
      if (!db_site) continue;

      if (!(await db.delete_device_av(locals.db_conn, device.device_id, cookies))) {
        console.log(`[API/V2/Devices/Purge/AV/Submit] Failed deletion on ${device.hostname}`);
      }
    }

    return Response.json({
      data: "Success",
      meta: {
        status: 200,
      }
    }, { status: 200 });
  } catch (err) {
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}