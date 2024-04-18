import { connect as db } from "$lib/server/database";
import { connect as auth } from "$lib/server/auth";

export const handle = async({event, resolve}) => {
  const db_conn = await db();
  auth();
  event.locals = { db_conn };
  const response = await resolve(event);
  db_conn.release();
  return response;
}