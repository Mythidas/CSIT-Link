import * as db from "$lib/server/database_v2";

export async function load({ locals, params }) {
  try {
    const db_site = await db.get_site(locals.db_conn, Number(params?.slug || -1));

    return {
      current_site: db_site
    }
  } catch (err) {
    console.log(err);
  }
}