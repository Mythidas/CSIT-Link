import * as db from "$lib/server/database";

export async function load({ locals, url }) {
  try {
    const db_patches = await db.get_patches(locals.db_conn);

    return {
      patches: db_patches
    }
  } catch (err) {
    console.log(err);
  }
}