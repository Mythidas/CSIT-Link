import * as db from "$lib/server/database";

export async function load({ locals }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn);
    const db_companies = await db.get_companies(locals.db_conn);

    return {
      sites: db_sites,
      companies: db_companies
    }
  } catch (err) {
    console.log(err);
  }
}