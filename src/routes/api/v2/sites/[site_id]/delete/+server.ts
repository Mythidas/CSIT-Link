import * as db from "$lib/server/database_v2.js";

export async function DELETE({ locals, params }) {
  try {
    const site = await db.get_site(locals.db_conn, Number(params.site_id || -1));
    if (!site) {
      console.log(`[API/V2/Sites/:site_id/Delete] Failed to find site ${params.site_id}`);
      return Response.json({
        meta: {
          error: `Failed to find site ${params.site_id}`,
          status: 500
        }
      }, { status: 500 });
    }

    await db.delete_site(locals.db_conn, site.site_id);
    console.log(`[API/V2/Sites/:site_id/Delete] Deleted site ${site.title}`);

    return Response.json({
      data: "Site Deleted",
      meta: {
        status: 200,
      }
    }, { status: 200 });
  } catch (err) {
    console.log(`[API/V2/Sites/:site_id/Delete] ${err}`);
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}