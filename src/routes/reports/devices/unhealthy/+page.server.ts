import type { Site } from "$lib/interfaces/i_db.js";
import * as db from "$lib/server/database";

function has_rmm(site: Site | undefined) {
  return site?.rmm_id !== "";
}

function has_av(site: Site | undefined) {
  return site?.av_id !== "";
}

export async function load({ locals }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn);
    const db_devices = await db.get_devices_all(locals.db_conn);
    const filtered_devices = db_devices.filter(device => {
      const site = db_sites.find(site => site.site_id === device.site_id);

      const missing_agents = (has_rmm(site) && device.rmm_id === "") || (has_av(site) && device.av_id === "");
      
      const now = Date.now();
      const rmm_hb = new Date(device.rmm_last_heartbeat).getTime();
      const av_hb = new Date(device.av_last_heartbeat).getTime();
      const stale_agents = (has_rmm(site) && (now - rmm_hb) > 2505600 * 1000) || (has_av(site) && (now - av_hb) > 2505600 * 1000);
      
      return missing_agents || stale_agents;
    });

    return {
      devices: filtered_devices
    }
  } catch (err) {
    console.log(err);
  }
}