import * as db from "$lib/server/database.js"

export async function GET({ request, locals, fetch }) {
  try {
    const site_id = request.headers.get("site-id");
    if (!site_id) return Response.json({ data: false, error: { message: "Invalid headers (Devices/Validate)"}}, { status: 400 });

    const site_data = await db.get_site(locals.db_conn, Number(site_id));
    if (!site_data) return Response.json({ data: false, error: { message: "Invalid Site (Devices/Validate)"}}, { status: 400 });

    const validate_res = await fetch("/api/v1/devices/validate?force=true", {
      headers: {
        "site-id": site_id
      }
    });
    const validate_data = await validate_res.json();

    if (!validate_res.ok) {
      return Response.json({ data: [], error: { message: "Failed to validate site", object: validate_data }}, { status: 500 });
    }

    const devices = await db.get_devices_by_site_id(locals.db_conn, Number(site_id));

    return Response.json({ data: devices }, { status: 200 });
  } catch {
    return Response.json({ data: false, error: { message: "Failed to get sites (V1/Devices)" }}, { status: 500 });
  }
}