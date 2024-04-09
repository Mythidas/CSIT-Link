import * as db from "$lib/server/database.js"
import type { _ExtDevice } from '$lib/interfaces/i_ext_info.js';
import { type APIResponse, api_response_log } from "$lib/interfaces/i_api_response";
import type { Device } from "$lib/interfaces/i_db";

export async function GET({ request, url, locals, fetch }) {
  try {
    const site_id = request.headers.get("site-id");
    if (!site_id) return Response.json({ data: false, error: { message: "Invalid headers (Devices/Validate)"}}, { status: 400 }); 

    const site_data = await db.get_site(locals.db_conn, Number(site_id));
    if (!site_data) return Response.json({ data: false, error: { message: "Invalid Site (Devices/Validate)"}}, { status: 400 });

    const force = Boolean(url.searchParams.get("force")) || false;

    const last_update = new Date(site_data.last_update);
    const elapsed = (Date.now() - last_update.getTime()) / 1000;

    // Update every hour
    if (elapsed > 3600 || isNaN(elapsed) || force) {
      if (!await db.delete_devices_by_site_id(locals.db_conn, Number(site_id))) {
        return Response.json({ data: false, error: { message: "Failed to get update devices (Devices/Validate)"}}, { status: 500 });
      }

      const rmm_res = await fetch("/api/external/rmm/devices", {
        headers: {
          "site-id": site_data.rmm_id
        }
      });
      const rmm_data = await rmm_res.json() as APIResponse;
      if (!rmm_res.ok) {
        api_response_log(rmm_data);
        return Response.json({ data: false, error: { message: "Failed to get RMM devices (Devices/Validate)"}}, { status: 500 });
      }
      const rmm_devices = rmm_data.data as _ExtDevice[];

      const av_res = await fetch("/api/external/av/devices", {
        headers: {
          "site-id": site_data.av_id,
          "site-url": site_data.av_url
        }
      });
      const av_data = await av_res.json() as APIResponse;
      if (!av_res.ok) {
        api_response_log(av_data);
        return Response.json({ data: false, error: { message: "Failed to get AV devices (Devices/Validate)"}}, { status: 500 });
      }
      const av_devices = av_data.data as _ExtDevice[];

      let devices: Device[] = [];

      for (let i = 0; i < rmm_devices.length; i++) {
        devices.push({ 
          id: -1, 
          title: rmm_devices[i].name, 
          site_id: Number(site_id), 
          os: rmm_devices[i].os, 
          psa_id: "", 
          rmm_id: rmm_devices[i].id,
          av_id: ""
        })
      }

      for (let i = 0; i < av_devices.length; i++) {
        const device = devices.find(dev => dev.title.toLowerCase() === av_devices[i].name.toLowerCase());
        if (device) {
          device.av_id = av_devices[i].id;
        } else {
          devices.push({
            id: -1, 
            title: av_devices[i].name, 
            site_id: Number(site_id), 
            os: av_devices[i].os, 
            psa_id: "", 
            rmm_id: av_devices[i].id,
            av_id: ""
          })
        }
      }

      const db_devices = await db.add_devices_by_site(locals.db_conn, Number(site_id), devices);

      if (db_devices.length !== devices.length) {
        return Response.json({ data: false, error: { message: "Device update inconsistent (Devices/Validate)"}}, { status: 500 });
      }
    }
    
    return Response.json({ data: true }, { status: 200 });
  } catch (err) {
    return Response.json({ data: false, error: { message: "Failed to validate (Devices/Validate)", object: err }}, { status: 500 });
  }
}