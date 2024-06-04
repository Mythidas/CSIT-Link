import * as db from "$lib/server/database_v2.js";

export async function POST({ request, locals }) {
  try {
    const filters = await request.json();
    const sites = await db.get_sites(locals.db_conn);

    console.log(filters);

    return Response.json({
      data: sites,
      meta: {
        status: 200
      }
    }, { status: 200 });
  } catch (err) {
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}