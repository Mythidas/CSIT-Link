import { dev } from "$app/environment";
import { PG_HOST, PG_USER, PG_DATABASE, PG_PASSWORD, PG_PORT } from "$env/static/private";
import type { Company, Site } from "$lib/interfaces/i_db";
import pg, { type PoolClient } from "pg";

import * as psa from "./api_psa";
import * as rmm from "./api_rmm";
import * as av from "./api_av";
import type { _PSAContractInfo } from "$lib/interfaces/i_ext_info";
import Debug from "$lib/tools/debug";
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

const debug = new Debug("database_v2");

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

export async function get_sites(client: PoolClient, columns: string[], values: string[], types: string[], sorting?: SortState): Promise<Site[]> {
  try {
    const query_filters = gen_filter_string(columns, values, types, sorting || { type: "", group: "", key: "", asc: true });
    
    if (query_filters.query) {
      return (await client.query(`SELECT se.*, 
      cy.company_title 
      FROM Site se 
      LEFT JOIN company cy ON se.company_id = cy.company_id ${query_filters.query};`, query_filters.values)).rows as Site[];
    }
      
    return (await client.query(`SELECT se.*, 
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

export async function delete_site(client: PoolClient, site_id: number): Promise<boolean> {
  try {
    const site = await get_site(client, site_id);
    if (!site) {
      console.log(`[delete_site] Failed to find site ${site_id}`);
      return false;
    }

    await client.query("DELETE FROM Site WHERE site_id = $1;", [site.site_id.toString()]);

    return true;
  } catch (err) {
    console.log(`[delete_site] ${err}`);
    return false;
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

export async function update_site_devices(client: PoolClient, site_id: number, cookies: Cookies) {
  try {
    const site = await get_site(client, site_id);
    if (!site || !site.last_update) {
      debug.log("update_site_devices", "Invalid site id");
      return false;
    };

    const av_devices = await av.get_devices(site.av_id, site.av_url, cookies) || [];
    const rmm_devices = await rmm.get_devices(site.rmm_id) || [];

    await client.query("UPDATE Site SET last_update = $1, av_count = $2, rmm_count = $3 WHERE site_id = $4;", [
      new Date().toISOString(), av_devices?.length.toString(), rmm_devices?.length.toString(), site.site_id.toString()
    ]);

    return true;
  } catch (err) {
    debug.log("update_site_devices", err as string);
    return false;
  }
}

// COMPANIES

export async function get_companies(client: PoolClient, columns: string[], values: string[], types: string[], sorting: SortState): Promise<Site[]> {
  try {
    const query_filters = gen_filter_string(columns, values, types, sorting);
    
    if (query_filters.query) {
      return (await client.query(`SELECT cy.* from Company cy ${query_filters.query};`, query_filters.values)).rows as Site[];
    }
      
    return (await client.query(`SELECT * from Company;`, query_filters.values)).rows as Site[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function add_company(client: PoolClient, new_company: Company): Promise<Company | null> {
  try {
    return (await client.query("INSERT INTO Company(company_title) VALUES ($1)", [new_company.company_title])).rows[0] || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// AB History

export async function post_ab_history_adjustment(client: PoolClient, site_id: number, adjustment: _PSAContractInfo): Promise<number | null> {
  try {
    const site = await get_site(client, site_id);
    if (!site) return null;
    if (!adjustment.change) return null;

    // const adjustment_api = await psa.post_contract_unit_adjustment(site, adjustment);
    // if (adjustment_api.meta.status !== 200) {
    //   console.log(`[post_ab_history_adjustment] ${adjustment_api.meta.error}`);
    //   return null;
    // }
    
    // const db_history = (await client.query("INSERT INTO ab_history (site_id,prev_count,new_count,psa_contract_id,psa_service_id,psa_service_type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;", [
    //   site_id.toString(),
    //   adjustment.units.toString(),
    //   adjustment_api.data.toString(),
    //   adjustment.psa_contract_id.toString(),
    //   adjustment.psa_service_id.toString(),
    //   adjustment.psa_service_type
    // ])).rows[0] || null;

    return null;
  } catch (err) {
    console.log(`[create_ab_history] ${err}`);
    return null;
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