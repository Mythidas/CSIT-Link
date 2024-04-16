import * as db from "$lib/server/database";

export async function load({ locals }) {
  try {
    const db_devices = await db.get_devices_all(locals.db_conn);
    const filtered_devices = db_devices.filter(device => {
      const missing_agents = device.rmm_id === "" || device.av_id === "";
      
      const now = Date.now();
      const rmm_hb = new Date(device.rmm_last_heartbeat).getTime();
      const av_hb = new Date(device.av_last_heartbeat).getTime();
      const stale_agents = (now - rmm_hb) > 2505600 * 1000 || (now - av_hb) > 2505600 * 1000;
      
      return missing_agents || stale_agents;
    });

    return {
      devices: filtered_devices
    }
  } catch (err) {
    console.log(err);
  }
}