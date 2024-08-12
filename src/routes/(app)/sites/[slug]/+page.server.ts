import * as db from "$lib/server/database_v2";
import * as av from "$lib/server/api_av.js";
import * as rmm from "$lib/server/api_rmm.js";
import { redirect } from "@sveltejs/kit";
import type { _SophosDevice, _VSAxDevice } from "$lib/interfaces/i_ext_info.js";
import Time from "$lib/tools/time.js";

export async function load({ locals, params, cookies }) {
  try {
    const db_site = await db.get_site(locals.db_conn, Number(params.slug || -1));
    if (!db_site) {
      redirect(301, "/sites");
    }

    if (new Date().getTime() - new Date(db_site.last_update).getTime() >= 3600 * 1000) {
      await db.update_site_devices(locals.db_conn, db_site.site_id, cookies);
    }

    const av_devices = await av.get_devices(db_site.av_id, db_site.av_url, cookies) || [];
    const rmm_devices = await rmm.get_devices(db_site.rmm_id) || [];

    const server_count = Math.max(av_devices.filter((_dev) => { return _dev.os.isServer }).length, 
      rmm_devices.filter((_dev) => { return _dev.Description.includes("Server") }).length);
    const workstation_count = Math.max(av_devices.filter((_dev) => { return !_dev.os.isServer }).length, 
      rmm_devices.filter((_dev) => { return !_dev.Description.includes("Server") }).length);
    const offline_count = Math.max(av_devices.filter((_dev) => { return new Time(_dev.lastSeenAt).is_older_than_30_days() }).length, 
      rmm_devices.filter((_dev) => { return new Time(_dev.LastSeenOnline).is_older_than_30_days() }).length);

    return {
      site: db_site,
      av_devices: av_devices ? av_devices.sort((a: _SophosDevice, b: _SophosDevice) => { return a.hostname.toLowerCase().localeCompare(b.hostname.toLowerCase())}) : [],
      rmm_devices: rmm_devices ? rmm_devices.sort((a: _VSAxDevice, b: _VSAxDevice) => { return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())}): [],
      server_count,
      workstation_count,
      offline_count
    }
  } catch (err) {
    console.log(err);
  }
}