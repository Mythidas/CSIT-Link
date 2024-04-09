import { PG_HOST, PG_USER, PG_DATABASE, PG_PASSWORD } from "$env/static/private";
import { type APIResponse } from "$lib/interfaces/i_api_response";
import { api_response_log } from "$lib/interfaces/i_api_response";
import type { Company, Device, Site } from "$lib/interfaces/i_db";
import type { _ExtDevice } from "$lib/interfaces/i_ext_info";
import pg, { type PoolClient } from "pg";

const pool = new pg.Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  ssl: true,
  port: 5432,
})

export const connect = async () => await pool.connect();

// SITES

export async function get_sites(client: PoolClient): Promise<Site[]> {
  try {
    return (await client.query("SELECT * FROM Site")).rows as Site[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function get_site(client: PoolClient, id: number): Promise<Site | null> {
  try {
    return (await client.query("SELECT * FROM Site WHERE site_id = $1", [id])).rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function get_site_from_url(client: PoolClient, url: string): Promise<Site | null> {
  let site_id = -1;
  let path_split = url.split("/");
  
  if (path_split[1] === "sites" && path_split.length > 2) {
    site_id = Number(path_split[path_split.length - 1]);
  }
  
  if (isNaN(site_id)) {
    return null;
  }

  return await get_site(client, site_id);
}

export async function add_site(client: PoolClient, site: Site): Promise<Site[]> {
  let values = [
    site.title,
    site.psa_id,
    site.rmm_id,
    site.av_id,
    site.av_url
  ];

  let col_state = "title,psa_id,rmm_id,av_id,av_url";
  let col_values = "$1,$2,$3,$4,$5";

  if (site.company_id >= 0) {
    col_state += ",company_id";
    col_values += ",$6";
    values.push(site.company_id.toString());
  }

  try {
    const res = await client.query(`INSERT INTO Site (${col_state}) VALUES (${col_values})`, values);
    return res.rows as Site[];
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

export async function add_company(client: PoolClient, company: Company): Promise<Company[]> {
  const values = [
    company.title
  ];

  try {
    const res = await client.query("INSERT INTO Company (title) VALUES ($1)", values);
    return res.rows as Company[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

// DEVICES

export async function get_devices_by_site_id(client: PoolClient, site: number): Promise<Device[]> {
  try {
    if (isNaN(site)) {
      return [];
    }

    return (await client.query("SELECT * FROM Device WHERE site_id = $1", [site]))?.rows || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function delete_devices_by_site_id(client: PoolClient, site: number): Promise<boolean> {
  try {
    if (isNaN(site)) {
      return false;
    }

    await client.query("DELETE FROM Device WHERE site_id = $1", [site]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function add_devices_by_site(client: PoolClient, site: number, devices: Device[]): Promise<Device[]> {
  try {
    if (isNaN(site) || devices.length === 0) {
      return [];
    }

    let args = "";
    let values: any[] = [];

    let arg_count = 1;
    for (let i = 0; i < devices.length; i++) {
      values.push(devices[i].title);
      values.push(devices[i].site_id);
      values.push(devices[i].os);
      values.push(devices[i].psa_id);
      values.push(devices[i].rmm_id);
      values.push(devices[i].av_id);
      
      args += `($${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++})`;
      if (i + 1 === devices.length) {
        args += " RETURNING *;";
      } else {
        args += ", "
      }
    }

    const db_devices = (await client.query(`INSERT INTO Device (title, site_id, os, psa_id, rmm_id, av_id) VALUES ${args}`, values))?.rows || [];
    if (db_devices.length === devices.length) {
      await client.query("UPDATE Site SET last_update = $1 WHERE site_id = $2", [new Date().toISOString(), site.toString()]);
    }

    return db_devices;
  } catch (err) {
    console.log(err);
    return [];
  }
}