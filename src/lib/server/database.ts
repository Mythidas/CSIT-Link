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
  const values = [
    site.title,
    site.company_id.toString(),
    site.psa_id,
    site.rmm_id,
    site.av_id,
    site.av_url
  ];

  try {
    const res = await client.query("INSERT INTO Site (title, company_id, psa_id, rmm_id, av_id, av_url) VALUES ($1, $2, $3, $4, $5, $6)", values);
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