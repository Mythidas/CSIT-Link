import * as db from "$lib/server/database";

export async function load({ locals }) {
  try {
    // const res = await locals.db_conn.query("SELECT * FROM Item WHERE id = 3");
  } catch (err) {
    console.log(err);
  }
}