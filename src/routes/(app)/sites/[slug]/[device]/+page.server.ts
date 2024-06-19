import * as db from "$lib/server/database_v2";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, params }) {
  try {
    const db_site = await db.get_site(locals.db_conn, Number(params.slug || -1));
    if (!db_site) {
      redirect(301, "/sites");
    }

    const db_device = await db.get_device(locals.db_conn, Number(params.device || -1));

    return {
      site: db_site,
      device: db_device
    }
  } catch (err) {
    console.log(err);
  }
}