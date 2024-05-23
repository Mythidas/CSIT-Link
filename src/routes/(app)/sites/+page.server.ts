import * as db from "$lib/server/database_v2";

function clamp_count(count: number) {
  if (count >= 100) {
    return 100;
  } else if (count >= 50) {
    return 50;
  } else {
    return 25;
  }
}
function clamp_page(page: number, count: number, total_devices: number) {
  return page * count > total_devices ? Math.ceil(total_devices / (page * count)) : page;
}

export async function load({ locals, url }) {
  const site_id = Number(url.searchParams.get("site_id") || -1);
  const page = Number(url.searchParams.get("page") || 1);
  const count = clamp_count(Number(url.searchParams.get("count") || 25));

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
      devices: db_devices,
      total_devices: db_devices.length,
      page: clamp_page(page, count, db_devices.length),
      count: count
    }
  } catch (err) {
    console.log(err);
  }
}