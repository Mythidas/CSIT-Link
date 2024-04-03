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

export async function get_sites(client: PoolClient): Promise<Site[]> {
  return (await client.query("SELECT * FROM Site")).rows as Site[];
}

export async function get_companies(client: PoolClient): Promise<Company[]> {
  return (await client.query("SELECT * FROM Company")).rows;
}