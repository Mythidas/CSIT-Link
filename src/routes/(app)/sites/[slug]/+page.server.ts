import * as db from "$lib/server/database_v2";
import * as av from "$lib/server/api_av.js";
import * as rmm from "$lib/server/api_rmm.js";
import { redirect } from "@sveltejs/kit";
import type { _SophosDevice, _VSAxDevice } from "$lib/interfaces/i_ext_info.js";

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
      av_devices: av_devices ? av_devices.sort((a: _SophosDevice, b: _SophosDevice) => { return a.hostname.toLowerCase().localeCompare(b.hostname.toLowerCase())}) : [],
      rmm_devices: rmm_devices ? rmm_devices.sort((a: _VSAxDevice, b: _VSAxDevice) => { return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())}): []
    }
  } catch (err) {
    console.log(err);
  }
}