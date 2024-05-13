import * as db from "$lib/server/database";

export async function load({ locals }) {
  try {
    const db_companies = await db.get_companies(locals.db_conn);

    return {
      companies: db_companies
    }
  } catch (err) {
    console.log(err);
  }
}