import * as db from "$lib/server/database_v2.js";
import * as av from "$lib/server/api_av.js"
import type { _SophosDevice, _SophosDeviceEXT } from "$lib/interfaces/i_ext_info.js";
import Time from "$lib/tools/time";

export async function load({ locals, cookies }) {
  try {
    let sophos_devices: _SophosDeviceEXT[] = [];
    
    const db_sites = await db.get_sites(locals.db_conn, [], [], [], { key: "", group: "", type: "", asc: true });
    
    for await (const site of db_sites) {
      const _devices = await av.get_devices(site.av_id, site.av_url, cookies);
      if (!_devices) continue;

      for (const _device of _devices) {
        if (!_device.tamperProtectionEnabled && !new Time(_device.lastSeenAt).is_older_than_30_days()) {
          sophos_devices.push({ ..._device, site_id: site.site_id, title: site.title });
        }
      }
    }

    return {
      sophos_devices
    }
  } catch (err) {
    console.log(err);
  }
}