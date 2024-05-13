import * as db from "$lib/server/database";

export async function load({ locals }) {
  try {
    const db_devices = await db.get_devices(locals.db_conn);

    return {
      devices: db_devices
    }
  } catch (err) {
    console.log(err);
  }
}