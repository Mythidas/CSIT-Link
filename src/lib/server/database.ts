import { PG_HOST, PG_USER, PG_DATABASE, PG_PASSWORD } from "$env/static/private";
import type { Company, Site } from "$lib/interfaces/i_db";
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