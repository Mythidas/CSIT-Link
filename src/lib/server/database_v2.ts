import { dev } from "$app/environment";
import { PG_HOST, PG_USER, PG_DATABASE, PG_PASSWORD, PG_PORT } from "$env/static/private";
import type { Company, Device, Site } from "$lib/interfaces/i_db";
import type { _ExtDevice } from "$lib/interfaces/i_ext_info";
import pg, { type PoolClient } from "pg";

const pool = new pg.Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  ssl: dev,
  port: Number(PG_PORT)
})

export const connect = async () => await pool.connect();

// SITES

export async function get_site(client: PoolClient, site_id: number): Promise<Site | null> {
  try {
    if (isNaN(site_id)) {
      return null;
    }

    return (await client.query("SELECT * FROM Site WHERE site_id = $1", [site_id])).rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function get_sites(client: PoolClient): Promise<Site[]> {
  try {
    return (await client.query("SELECT * FROM Site")).rows.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase())) as Site[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

// COMPANIES

export async function get_companies(client: PoolClient): Promise<Company[]> {
  try {
    return (await client.query("SELECT * FROM Company")).rows;
  } catch (err) {
    console.log(err);
    return [];
  }
}

// DEVICES

export async function get_devices_all(client: PoolClient): Promise<Device[]> {
  try {
    const sites = await get_sites(client);

    const sort_devices = (a: Device, b: Device) => {
      const site_a = sites.find((site) => { return site.site_id === a.site_id; });
      const site_b = sites.find((site) => { return site.site_id === b.site_id; });
      return site_a?.title.toLowerCase().localeCompare(site_b?.title.toLowerCase() || "") || -1;
    }

    const devices = (await client.query("SELECT * FROM Device"))?.rows as Device[] || [] as Device[];
    return devices.sort(sort_devices);
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function get_devices_by_site_id(client: PoolClient, site_id: number): Promise<Device[]> {
  try {
    if (isNaN(site_id) || site_id < 0) {
      return [];
    }

    const sort_devices = (a: Device, b: Device) => {
      if (a.os_type < b.os_type) return -1;
      if (a.os_type > b.os_type) return 1;

      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }

    const devices = (await client.query("SELECT * FROM Device WHERE site_id = $1", [site_id]))?.rows as Device[] || [] as Device[];
    return devices.sort(sort_devices);
  } catch (err) {
    console.log(err);
    return [];
  }
}