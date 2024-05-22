import * as db from "$lib/server/database_v2";

export async function load({ locals }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn);
    const db_companies = await db.get_companies(locals.db_conn);
    const db_devices = await db.get_devices(locals.db_conn);

    let sites_joined = [];

    for (let i = 0; i < db_sites.length; i++) {
      sites_joined.push({ company: db_companies.filter(comp => comp.company_id === db_sites[i].company_id)[0]?.title || "(None)", ...db_sites[i] });
    }

    return {
      sites: sites_joined,
      devices: db_devices
    }
  } catch (err) {
    console.log(err);
  }
}