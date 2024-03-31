import { connect } from "$lib/server/database";

export const handle = async({event, resolve}) => {
  const db_conn = await connect();
  event.locals = { db_conn };
  const response = await resolve(event);
  db_conn.release();
  return response;
}