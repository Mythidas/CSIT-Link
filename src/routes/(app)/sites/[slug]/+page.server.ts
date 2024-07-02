import * as db from "$lib/server/database_v2";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, params }) {
  try {
    const db_site = await db.get_site(locals.db_conn, Number(params.slug || -1));
    if (!db_site) {
      redirect(301, "/sites");
    }

    const device_counts = await db.get_device_counts_by_site_id(locals.db_conn, db_site.site_id);

    return {
      site: db_site,
      total_devices: device_counts?.total,
      av_devices: device_counts?.av,
      rmm_devices: device_counts?.rmm
    }
  } catch (err) {
    console.log(err);
  }
}