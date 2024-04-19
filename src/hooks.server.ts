import { connect as db } from "$lib/server/database";

export const handle = async({ event, resolve }) => {
  try {
    const db_conn = await db();
    event.locals = { db_conn };
    const response = await resolve(event);
    db_conn.release();
    return response;
  } catch (err) {
    console.log(err);
    return await resolve(event);
  }
}