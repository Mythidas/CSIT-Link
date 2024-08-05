import * as db from "$lib/server/database_v2.js";

export async function POST({ request, locals, cookies }) {
  try {
    const body = await request.json();
    const migration_db = await db.create_migration_av(locals.db_conn, body.from, body.to, body.ids.map((dev: any) => { return dev.av }), cookies);

    if (!migration_db) {
      console.log(`[API/V2/Devices/Migrate] Failed to create Migration AV`);
      return Response.json({
        meta: {
          error: "Failed to create Migration AV",
          status: 500
        }
      }, { status: 500 });
    }

    return Response.json({
      data: migration_db,
      meta: {
        status: 200,
      }
    }, { status: 200 });
  } catch (err) {
    console.log(`[API/V2/Devices/Migrate] ${err}`);

    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}