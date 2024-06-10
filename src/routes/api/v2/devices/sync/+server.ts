import * as db from "$lib/server/database_v2.js";
import * as rmm from "$lib/server/api_rmm";
import * as av from "$lib/server/api_av";
import type { Device, DeviceRMM } from "$lib/interfaces/i_db.js";

import * as fs from 'fs/promises';

export async function POST({ locals, cookies }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn, [], [], [], { key: "", asc: true, group: "", type: "" });
    const rmm_devices = await rmm.get_devices_all();

    if (!rmm_devices.data) {
      return Response.json({
        meta: {
          error: "Failed to get RMM Devices",
          status: 500
        }
      }, { status: 500 });
    }
    
    console.log(`Total RMM Devices: ${rmm_devices.data.device_list.length}`);
    for await (const site of db_sites) {
      const devices = await db.get_devices_by_site_id(locals.db_conn, site.site_id);
      const av_devices_res = await av.get_devices(site.av_id, site.av_url, cookies);
      let device_list: Device[] = [];
      let rmm_list: DeviceRMM[] = [];

      for (let i = 0; i < rmm_devices.data.device_list.length; i++) {
        if (Number(rmm_devices.data.device_list[i].site_id) === Number(site.rmm_id)) {
          device_list.push(rmm_devices.data.device_list[i]);
          rmm_list.push(rmm_devices.data.rmm_list[i]);
        }
      }

      if (!device_list.length && !rmm_list.length && !av_devices_res.data.device_list.length && !devices.length) continue;
      await db.load_devices(locals.db_conn, site, devices, { device_list, rmm_list }, av_devices_res.data);
    }
    console.log("Finished Syncing Devices...");

    return Response.json({
      data: "Devices Synced",
      meta: {
        status: 200,
      }
    }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}