import * as db from "$lib/server/database_v2";
import * as av from "$lib/server/api_av.js";
import * as rmm from "$lib/server/api_rmm.js";
import { redirect } from "@sveltejs/kit";
import type { Device } from "$lib/interfaces/i_db.js";

export async function load({ locals, params, cookies }) {
  try {
    const db_site = await db.get_site(locals.db_conn, Number(params.slug || -1));
    if (!db_site) {
      redirect(301, "/sites");
    }

    const av_devices = await av.get_devices(db_site.av_id, db_site.av_url, cookies);
    const rmm_devices = await rmm.get_devices(db_site.rmm_id);

    return {
      site: db_site,
      av_devices: av_devices.data ? av_devices.data.device_list.sort((a: Device, b: Device) => { return a.hostname.toLowerCase().localeCompare(b.hostname.toLowerCase())}) : [],
      rmm_devices: rmm_devices.data ? rmm_devices.data.device_list.sort((a: Device, b: Device) => { return a.hostname.toLowerCase().localeCompare(b.hostname.toLowerCase())}): []
    }
  } catch (err) {
    console.log(err);
  }
}