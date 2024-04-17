import { api_response_log, type APIResponse } from "$lib/interfaces/i_api_response.js";
import * as db from "$lib/server/database";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, url, fetch }) {
  const db_site = await db.get_site_from_url(locals.db_conn, url.pathname);
  if (!db_site) {
    redirect(302, "/sites");
  }

  try {
    const validate = await fetch("/api/v1/devices/validate", {
      headers: {
        "site-id": db_site.site_id.toString()
      }
    });
    const validate_data = await validate.json() as APIResponse;

    if (!validate.ok) {
      api_response_log(validate_data);
      return {
        site: db_site,
        devices: []
      }
    }

    const db_devices = await db.get_devices_by_site_id(locals.db_conn, db_site.site_id);
    const db_site_updated = await db.get_site(locals.db_conn, db_site.site_id);

    return {
      site: db_site_updated,
      devices: db_devices
    }
  } catch (err) {
    console.log(err);
  }
}