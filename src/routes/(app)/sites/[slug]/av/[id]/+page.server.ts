import * as db from "$lib/server/database_v2";
import * as av from "$lib/server/api_av.js";
import { redirect } from "@sveltejs/kit";
import type { _SophosDevice, _SophosDeviceEXT, _VSAxDevice } from "$lib/interfaces/i_ext_info.js";

export async function load({ locals, params, cookies }) {
  try {
    const db_site = await db.get_site(locals.db_conn, Number(params.slug || -1));
    if (!db_site) {
      redirect(301, "/sites");
    }

    const av_devices = await av.get_devices(db_site.av_id, db_site.av_url, cookies) || [];
    const av_device = av_devices.find((_dev) => { return _dev.id === params.id; }) as _SophosDeviceEXT;

    if (!av_device) {
      redirect(301, `/sites/${db_site.site_id}`);
    }

    const av_tamper_status = await av.get_tamper_status(av_device.id, db_site.av_id, db_site.av_url, cookies);

    if (av_tamper_status) {
      av_device.tamper_info = { enabled: av_tamper_status.enabled, password: av_tamper_status.tp_pass };
    }

    return {
      site: db_site,
      av_device
    }
  } catch (err) {
    console.log(err);
  }
}