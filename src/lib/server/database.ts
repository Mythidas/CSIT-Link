import { PG_HOST, PG_USER, PG_DATABASE, PG_PASSWORD } from "$env/static/private";
import type APIResponse from "$lib/interfaces/i_api_response";
import type { Company, Device, Site } from "$lib/interfaces/i_db";
import type { _ExtDevice } from "$lib/interfaces/i_ext_info";
import pg, { type PoolClient } from "pg";

const pool = new pg.Pool({
  user: PG_USER,
  host: PG_HOST,
  database: "dev-data",
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

// Get Site, Check last update, return devices if in range, else get new devices through fetch, save new devices, return new devices
export async function get_devices_by_site(client: PoolClient, site: number): Promise<Device[]> {
  try {
    const site_data = (await client.query("SELECT * FROM Site WHERE site_id = $1", [site]))?.rows[0] as Site || null;
    if (!site_data) return [];

    const last_update = new Date(site_data.last_update);
    const elapsed = (Date.now() - last_update.getMilliseconds()) / 1000;

    // Update every hour
    if (elapsed > 3600) {
      const rmm_res = await fetch("/api/external/rmm/devices", {
        headers: {
          "site-id": site_data.rmm_id
        }
      });
      if (!rmm_res.ok) return [];
      const rmm_data = await rmm_res.json() as APIResponse;
      const rmm_devices = rmm_data.data as _ExtDevice[];

      const av_res = await fetch("/api/external/av/devices", {
        headers: {
          "site-id": site_data.av_id,
          "site-url": site_data.av_url
        }
      });
      if (!av_res.ok) return [];
      const av_data = await av_res.json() as APIResponse;
      const av_devices = av_data.data as _ExtDevice[];

      let devices: Device[] = [];

      for (let i = 0; i < rmm_devices.length; i++) {
        devices.push({ 
          id: -1, 
          title: rmm_devices[i].name, 
          site_id: site, 
          os: rmm_devices[i].os, 
          psa_id: "", 
          rmm_id: rmm_devices[i].id,
          av_id: ""
        })
      }

      for (let i = 0; i < av_devices.length; i++) {
        const device = devices.find(dev => dev.title.toLowerCase() === av_devices[i].name.toLowerCase());
        if (device) {
          device.av_id = av_devices[i].id;
        } else {
          devices.push({
            id: -1, 
            title: av_devices[i].name, 
            site_id: site, 
            os: av_devices[i].os, 
            psa_id: "", 
            rmm_id: av_devices[i].id,
            av_id: ""
          })
        }
      }

      // Save the new list to DB and return values
      
      return devices;
    } else {
      return (await client.query("SELECT * FROM Device WHERE site_id = $1", [site]))?.rows || [];
    }

  } catch (err) {
    console.log(err);
    return [];
  }
}