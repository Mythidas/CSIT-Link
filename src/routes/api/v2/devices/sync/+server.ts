import * as db from "$lib/server/database_v2.js";
import * as rmm from "$lib/server/api_rmm";
import * as av from "$lib/server/api_av";
import type { Device, DeviceRMM } from "$lib/interfaces/i_db.js";

import { promises as fs } from 'fs';

async function save_date_to_file(filePath: string, data: string): Promise<void> {
  try {
    // Check if the file exists
    await fs.access(filePath);
  } catch (err) {
    // If the file doesn't exist, create it with 'wx' flag (write only, create if doesn't exist)
    await fs.writeFile(filePath, data, { flag: 'wx' });
    console.log(`File created: ${filePath}`);
    return;
  }

  // If the file exists, handle the case (e.g., throw error, append data)
  // Handle existing'' file logic here (optional)
}

async function get_data_from_file(file_path: string) {
  try {
    // Check if the file exists
    await fs.access(file_path);
    // Load data if file exists
    const data = await fs.readFile(file_path, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // If the file doesn't exist, run the other function
    return await rmm.get_devices_all();
  }
}

export async function GET({ locals, cookies }) {
  try {
    console.log("[API/V2/Devices/Sync] Starting Devices Sync...");
    const db_sites = await db.get_sites(locals.db_conn, [], [], [], { key: "", asc: true, group: "", type: "" });
    const rmm_devices = await rmm.get_devices_all();

    await save_date_to_file("./rmm_devices", JSON.stringify(rmm_devices, null, 2));

    if (!rmm_devices.data) {
      return Response.json({
        meta: {
          error: "[API/V2/Devices/Sync] Failed to get RMM Devices",
          status: 500
        }
      }, { status: 500 });
    }
    
    console.log(`[API/V2/Devices/Sync] Total RMM Devices: ${rmm_devices.data.device_list.length}`);
    for await (const site of db_sites) {
      try {
        const devices = await db.get_devices_by_site_id(locals.db_conn, site.site_id);
        const av_devices_res = await av.get_devices(site.av_id, site.av_url, cookies);
        if (av_devices_res.meta.status !== 200 && site.av_id) {
          console.log(`[API/V2/Devices/Sync] Failed to load AV devices: ${site.title}`);
          continue;
        }

        let device_list: Device[] = [];
        let rmm_list: DeviceRMM[] = [];

        for (let i = 0; i < rmm_devices.data.device_list.length; i++) {
          if (Number(rmm_devices.data.device_list[i].rmm_id) === Number(site.rmm_id)) {
            device_list.push({...rmm_devices.data.device_list[i]});
            rmm_list.push({...rmm_devices.data.rmm_list[i]});
          }
        }

        await db.load_devices(locals.db_conn, site, devices, { device_list, rmm_list }, av_devices_res.data || { device_list: [], av_list: [] });
        console.log(`[API/V2/Devices/Sync] Loaded site: ${site.title} [${devices.length}, ${device_list.length}, ${av_devices_res.data && av_devices_res.data.device_list.length}]`);
      } catch (err) {
        console.log(`[API/V2/Devices/Sync] Error loading site: ${site.title}`);
      }
    }
    console.log("[API/V2/Devices/Sync] Finished Syncing Devices...");

    return Response.json({
      data: "Devices Synced",
      meta: {
        status: 200,
      }
    }, { status: 200 });
  } catch (err) {
    console.log(`[API/V2/Devices/Sync] ${err}`);
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}