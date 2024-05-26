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

export async function add_site(client: PoolClient, new_site: Site): Promise<Site | null> {
  let values = [
    new_site.title,
    new_site.psa_id,
    new_site.rmm_id,
    new_site.av_id,
    new_site.av_url
  ];

  let col_state = "title,psa_id,rmm_id,av_id,av_url";
  let col_values = "$1,$2,$3,$4,$5";

  if (new_site.company_id >= 0) {
    col_state += ",company_id";
    col_values += ",$6";
    values.push(new_site.company_id.toString());
  }

  try {
    const res = await client.query(`INSERT INTO Site (${col_state}) VALUES (${col_values})`, values);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    return null;
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

export async function add_company(client: PoolClient, new_company: Company): Promise<Company | null> {
  try {
    return (await client.query("INSERT INTO Company(title) VALUES ($1)", [new_company.title])).rows[0] || null;
  } catch (err) {
    console.log(err);
    return null;
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
      return a.hostname.toLowerCase().localeCompare(b.hostname.toLowerCase());
    }

    const devices = (await client.query("SELECT * FROM Device WHERE site_id = $1", [site_id]))?.rows as Device[] || [] as Device[];
    return devices.sort(sort_devices);
  } catch (err) {
    console.log(err);
    return [];
  }
}