import { dev } from "$app/environment";
import { PG_HOST, PG_USER, PG_DATABASE, PG_PASSWORD, PG_PORT } from "$env/static/private";
import type { Company, Device, DeviceAV, DeviceAll, DeviceRMM, Site } from "$lib/interfaces/i_db";
import pg, { type PoolClient } from "pg";

import * as psa from "./api_psa";
import * as rmm from "./api_rmm";
import * as av from "./api_av";
import type { Cookies } from "@sveltejs/kit";

const pool = new pg.Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  ssl: dev,
  port: Number(PG_PORT)
})

export const connect = async () => await pool.connect();

interface SortState {
  key: string;
  group: string; 
  asc: boolean; 
  type: string;
}

// SITES

export async function get_site(client: PoolClient, site_id: number): Promise<Site | null> {
  try {
    if (isNaN(site_id)) {
      return null;
    }

    return (await client.query("SELECT * FROM Site WHERE site_id = $1;", [site_id])).rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function get_sites(client: PoolClient, columns: string[], values: string[], types: string[], sorting: SortState): Promise<Site[]> {
  try {
    const query_filters = gen_filter_string(columns, values, types, sorting);
    
    if (query_filters.query) {
      return (await client.query(`SELECT se.*, 
      (SELECT COUNT(*) FROM device de WHERE de.site_id = se.site_id) AS device_tally,
      cy.company_title 
      FROM Site se 
      LEFT JOIN company cy ON se.company_id = cy.company_id ${query_filters.query};`, query_filters.values)).rows as Site[];
    }
      
    return (await client.query(`SELECT se.*, 
    (SELECT COUNT(*) FROM device de WHERE de.site_id = se.site_id) AS device_tally,
    cy.company_title 
    FROM Site se 
    LEFT JOIN company cy ON se.company_id = cy.company_id;`)).rows as Site[];
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

export async function is_site_updated(client: PoolClient, site_id: number): Promise<boolean> {
  try {
    const site = await get_site(client, site_id);
    
    if (!site || !site.last_update) return false;
    return new Date().getTime() - new Date(site.last_update).getTime() <= 60 * 60 * 1000;
  } catch (err)  {
    console.log(err);
    return false;
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

export async function get_device(client: PoolClient, device_id: number): Promise<DeviceAll | null> {
  try {
    return (await client.query(`SELECT de.*, dv.*, dm.*, se.*
      FROM Device de 
      LEFT JOIN DeviceAV dv ON de.device_id = dv.device_id
      LEFT JOIN DeviceRMM dm ON de.device_id = dm.device_id
      LEFT JOIN Site se ON de.site_id = se.site_id
      WHERE de.device_id = $1;`, [device_id.toString()])).rows[0] as DeviceAll || null;
  } catch (err) {
    console.log(`[get_device] ${err}`);
    return null;
  }
}

export async function get_devices(client: PoolClient, columns: string[], values: string[], types: string[], sorting: SortState): Promise<DeviceAll[]> {
  try {
    const query_filters = gen_filter_string(columns, values, types, sorting);
    
    if (query_filters.query) {
      return (await client.query(`SELECT de.*, dv.*, dm.*, se.*, cy.company_title
      FROM Device de 
      LEFT JOIN DeviceAV dv ON de.device_id = dv.device_id
      LEFT JOIN DeviceRMM dm ON de.device_id = dm.device_id 
      LEFT JOIN Site se ON de.site_id = se.site_id 
      LEFT JOIN Company cy ON se.company_id = cy.company_id ${query_filters.query};`, query_filters.values)).rows as DeviceAll[];
    }

    return (await client.query(`SELECT de.*, dv.*, dm.*, se.*, cy.company_title
    FROM Device de 
    LEFT JOIN DeviceAV dv ON de.device_id = dv.device_id
    LEFT JOIN DeviceRMM dm ON de.device_id = dm.device_id
    LEFT JOIN Site se ON de.site_id = se.site_id
    LEFT JOIN Company cy ON se.company_id = cy.company_id;`)).rows as DeviceAll[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function get_devices_all(client: PoolClient): Promise<Device[]> {
  try {
    const sites = await get_sites(client, [], [], [], { key: "", group: "", asc: true, type: "" });

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

export async function get_devices_by_site_id(client: PoolClient, site_id: number): Promise<DeviceAll[]> {
  try {
    if (isNaN(site_id) || site_id < 0) {
      return [];
    }

    const devices = (await client.query("SELECT * FROM Device WHERE site_id = $1;", [site_id]))?.rows as Device[] || [];
    const rmm_devices = (await client.query("SELECT * FROM DeviceRMM WHERE site_id = $1;", [site_id]))?.rows as DeviceRMM[] || [];
    const av_devices = (await client.query("SELECT * FROM DeviceAV WHERE site_id = $1;", [site_id]))?.rows as DeviceAV[] || [];
    
    let devices_joined: DeviceAll[] = [];
    for (let i = 0; i < devices.length; i++) {
      const _device_rmm = rmm_devices.find(dev => { return dev.device_id === devices[i].device_id }) as DeviceRMM;
      const _device_av = av_devices.find(dev => { return dev.device_id === devices[i].device_id }) as DeviceAV;
      devices_joined.push({ ...devices[i], ..._device_rmm, ..._device_av });
    }

    return devices_joined;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function delete_device_av(client: PoolClient, device_id: number, av_site_id: string, av_site_url: string, cookies: Cookies) {
  try {
    const device = await get_device(client, device_id);
    if (!device || !device.av_id) return false;

    const site = await get_site(client, device.site_id);
    if (!site) return false;

    const av_status = await av.delete_device_av(device.av_id, site.av_id, site.av_url, cookies);
    if (av_status.meta.status !== 200 && av_status.meta.error.error !== "resourceNotFound") {
      console.log(`[delete_device_av] Failed to delete AV device ${device.av_id}: ${av_status.meta.error.error}`);
      return false;
    }

    await client.query("DELETE FROM DeviceAV WHERE device_id = $1;", [device.device_id]);

    return av_status.data;
  } catch (err) {
    console.log(`[delete_device_av] ${err}`);
    return false;
  }
}

export async function load_devices_by_site_id(client: PoolClient, site_id: number, cookies: Cookies) {
  const site = await get_site(client, site_id);
  if (!site) return;
  
  const devices = await get_devices_by_site_id(client, site_id);
  const rmm_device_res = await rmm.get_devices(site.rmm_id);
  const av_device_res = await av.get_devices(site.av_id, site.av_url, cookies);

  await load_devices(client, site, devices, rmm_device_res.data || { device_list: [], rmm_list: [] }, av_device_res.data || { device_list: [], rmm_list: [] });
}

export async function load_devices(client: PoolClient, site: Site, devices: DeviceAll[], rmm_device_res: { device_list: Device[], rmm_list: DeviceRMM[] }, av_device_res: { device_list: Device[], av_list: DeviceAV[] }): Promise<void> {
  try {
    // Gather all "unique" devices
    let pre_devices: Device[] = [];
    for (let i = 0; i < rmm_device_res.device_list.length; i++) {
      let _device = rmm_device_res.device_list[i] as Device;
      _device.site_id = site.site_id;
      _device.device_id = -1;
      pre_devices.push(_device);
    }
    for (let i = 0; i < av_device_res.device_list.length; i++) {
      let _device = av_device_res.device_list[i] as Device;
      const _dupe = pre_devices.find(dev => {
        let _hn = dev.hostname.toLowerCase() === _device.hostname.toLowerCase();
        //let _mac = (dev.mac && _device.mac) && dev.mac.toLowerCase() === _device.mac.toLowerCase();
        return _hn;
      });

      if (!_dupe) {
        _device.site_id = site.site_id;
        if (!_device.mac) _device.mac = av_device_res.device_list[i].mac;
        if (!_device.ipv4) _device.ipv4 = av_device_res.device_list[i].ipv4;
        if (!_device.wan) _device.wan = av_device_res.device_list[i].wan;
        pre_devices.push(_device);
      } else {
        if (!_dupe.mac) _dupe.mac = av_device_res.device_list[i].mac;
        if (!_dupe.ipv4) _dupe.ipv4 = av_device_res.device_list[i].ipv4;
        if (!_dupe.wan) _dupe.wan = av_device_res.device_list[i].wan;
      }
    }

    // Update device_id from existing devices
    for (let i = 0; i < pre_devices.length; i++) {
      const _device = devices.find(dev => {
        return dev.hostname.toLowerCase() === pre_devices[i].hostname.toLowerCase();
      })

      if (_device) {
        pre_devices[i].device_id = _device.device_id;
      }
    }

    // Insert all new unique devices
    let device_query = "INSERT INTO Device (site_id,hostname,os,mac,ipv4,wan) VALUES ";
    let device_values: string[] = [];
    let paramter_counter = 1;
    for (let i = 0; i < pre_devices.length; i++) {
      if (pre_devices[i].device_id >= 0) continue;

      device_query += `($${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++}),`;
      device_values.push(pre_devices[i].site_id.toString());
      device_values.push(pre_devices[i].hostname);
      device_values.push(pre_devices[i].os);
      device_values.push(pre_devices[i].mac);
      device_values.push(pre_devices[i].ipv4);
      device_values.push(pre_devices[i].wan);
    }
    device_query = device_query.slice(0, -1) + " RETURNING device_id, site_id, hostname;";

    let new_device_res: Device[] = [];

    if (paramter_counter > 1) {
      console.log(`[load_devices] Inserted new Unique Devices: ${site.title}`)
      new_device_res = (await client.query(device_query, device_values))?.rows as Device[] || [];
    }

    if (new_device_res.length > 0) {
      // Insert RMM relations for new devices
      let rmm_device_query = "INSERT INTO DeviceRMM (device_id,site_id,rmm_id,heartbeat_rmm,firewall,uac,memory,custom_fields) VALUES "
      let rmm_device_values:string [] = [];
      paramter_counter = 1;
      for (let i = 0; i < new_device_res.length; i++) {
        const _device_index = rmm_device_res.device_list.findIndex((dev: Device) => {
          return dev.hostname.toLowerCase() === new_device_res[i].hostname.toLowerCase();
        })
        const _device = rmm_device_res.rmm_list[_device_index] as DeviceRMM;
        if (!_device) continue;

        rmm_device_query += `($${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++}),`;
        rmm_device_values.push(new_device_res[i].device_id.toString());
        rmm_device_values.push(new_device_res[i].site_id.toString());
        rmm_device_values.push(_device.rmm_id);
        rmm_device_values.push(_device.heartbeat_rmm || "");
        rmm_device_values.push(String(_device.firewall));
        rmm_device_values.push(String(_device.uac));
        rmm_device_values.push(String(_device.memory || 0));
        rmm_device_values.push(JSON.stringify(_device.custom_fields || {}));
      }
      rmm_device_query = rmm_device_query.slice(0, -1) + ";";

      console.log(`[load_devices] Inserted new DeviceRMM: ${site.title}`)
      const new_device_rmm_res = (await client.query(rmm_device_query, rmm_device_values))?.rows as DeviceRMM[] || [];

      // Insert AV relations for new devices
      let av_device_query = "INSERT INTO DeviceAV (device_id,site_id,av_id,heartbeat_av,tamper,health) VALUES "
      let av_device_values:string [] = [];
      paramter_counter = 1;
      for (let i = 0; i < new_device_res.length; i++) {
        const _device_index = av_device_res.device_list.findIndex((dev: Device) => {
          return dev.hostname.toLowerCase() === new_device_res[i].hostname.toLowerCase();
        })
        const _device = av_device_res.av_list[_device_index] as DeviceAV;
        if (!_device) continue;

        av_device_query += `($${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++},$${paramter_counter++}),`;
        av_device_values.push(new_device_res[i].device_id.toString());
        av_device_values.push(new_device_res[i].site_id.toString());
        av_device_values.push(_device.av_id);
        av_device_values.push(_device.heartbeat_av || "");
        av_device_values.push(String(_device.tamper));
        av_device_values.push(_device.health);
      }
      av_device_query = av_device_query.slice(0, -1) + ";";

      console.log(`[load_devices] Inserted new DeviceAV: ${site.title}`)
      const new_device_av_res = (await client.query(av_device_query, av_device_values))?.rows as DeviceRMM[] || [];
    }

    // Update existing devices
    console.log(`[load_devices] Update Devices: ${site.title}`)
    for (let i = 0; i < pre_devices.length; i++) {
      if (pre_devices[i].device_id < 0) continue;

      let update_query = "UPDATE Device SET ipv4 = $1, wan = $2 WHERE device_id = $3;";
      let update_rmm_query = "UPDATE DeviceRMM SET heartbeat_rmm = $1, firewall = $2, uac = $3, memory = $4, custom_fields = $5 WHERE device_id = $6;";
      let update_av_query = "UPDATE DeviceAV SET heartbeat_av = $1, tamper = $2, health = $3 WHERE device_id = $4;";

      try {
        await client.query(update_query, [
          pre_devices[i].ipv4,
          pre_devices[i].wan,
          pre_devices[i].device_id.toString()
        ]);

        if (av_device_res.device_list) {
          const _device_av_index = av_device_res.device_list.findIndex((dev: Device) => {
            return dev.hostname.toLowerCase() === pre_devices[i].hostname.toLowerCase();
          })
          const _device_av = av_device_res.av_list[_device_av_index] as DeviceAV;

          if (_device_av) {
            await client.query(update_av_query, [
              _device_av.heartbeat_av,
              String(_device_av.tamper),
              _device_av.health,
              String(pre_devices[i].device_id)
            ]);
          }
        }

        if (rmm_device_res.device_list) {
          const _device_rmm_index = rmm_device_res.device_list.findIndex((dev: Device) => {
            return dev.hostname.toLowerCase() === pre_devices[i].hostname.toLowerCase();
          })
          const _device_rmm = rmm_device_res.rmm_list[_device_rmm_index] as DeviceRMM;

          if (_device_rmm) {
            await client.query(update_rmm_query, [
              _device_rmm.heartbeat_rmm,
              String(_device_rmm.firewall),
              String(_device_rmm.uac),
              String(_device_rmm.memory || 0),
              JSON.stringify(_device_rmm.custom_fields || {}),
              String(pre_devices[i].device_id)
            ]);
          }
        }
      } catch (err) {
        console.log(`[load_devices] Failed to Update Devices: ${site.title}`)
      }
    }

    // Remove deleted devices
    console.log(`[load_devices] Delete Removed Devices: ${site.title}`)
    for (let i = 0; i < devices.length; i++) {
      const _device = pre_devices.find(dev => {
        return dev.hostname.toLowerCase() === devices[i].hostname.toLowerCase();
      })

      if (!_device) {
        await client.query(`DELETE FROM DeviceRMM WHERE device_id = $1;
        DELETE FROM DeviceAV WHERE device_id = $1;
        DELETE FROM Device WHERE device_id = $1;`, [devices[i].device_id.toString()]);
      }
    }

    await client.query("UPDATE Site SET last_update = $1 WHERE site_id = $2;", [new Date().toISOString(), site.site_id.toString()]);
  } catch (err) {
    console.log(`[load_devices] ${err}: ${site.title}`);
    return;
  }
}

// HELPERS

function get_filter_column(group: string, key: string) {
  if (!group) return key;
  return `${group[0] + group[group.length - 1]}.${key}`;
}

function gen_filter_string(columns: string[], values: string[], types: string[], sorting: SortState): { query: string, values: string[] } {
  let query_filters = "";
  let value_index = 1;
  let values_trimmed = [];
  let sorting_query = "";
  if (sorting.key) {
    switch (sorting.type) {
      case "Text": sorting_query = ` ORDER BY LOWER(${get_filter_column(sorting.group, sorting.key)}) ${sorting.asc ? "ASC" : "DESC"}`; break;
      case "Select": sorting_query = ` ORDER BY LOWER(${get_filter_column(sorting.group, sorting.key)}) ${sorting.asc ? "ASC" : "DESC"}`; break;
      default: sorting_query = ` ORDER BY ${get_filter_column(sorting.group, sorting.key)} ${sorting.asc ? "ASC" : "DESC"}`;
    }
  }

  for (let i = 0; i < columns.length; i++) {
    if (values[i]) {
      if (!query_filters) {
        query_filters += "WHERE ";
      } else {
        query_filters += " AND ";
      }

      const _f_index = Math.max(values[i].lastIndexOf('>'), values[i].lastIndexOf('<'), values[i].lastIndexOf('='));
      const _formula = _f_index >= 0 ? values[i].slice(0, _f_index + 1) : ">=";
      switch(types[i]) {
        case "Text": query_filters += `${columns[i]} ILIKE $${value_index++}`; break;
        case "Number": query_filters += `${columns[i]} ${_formula} $${value_index++}`; break;
        case "Bool": query_filters += `${columns[i]} = $${value_index++}`; break;
        case "Select": query_filters += `${columns[i]} ILIKE $${value_index++}`; break;
        case "Date": query_filters += `${columns[i]} ${_formula} $${value_index++}`; break;
        default: query_filters += `${columns[i]} ILIKE $${value_index++}`; break;
      }

      if (_f_index > -1) {
        values[i] = values[i].slice(_f_index + 1).trim();
        if (!values[i]) values[i] = "0";
      }

      if (types[i] === "Text" || types[i] === "Select") {
        values[i] = `%${values[i]}%`;
      }

      values_trimmed.push(values[i]);
    }
  }

  return value_index > 1 ? { query: query_filters + sorting_query, values: values_trimmed } : { query: sorting_query + "", values };
}