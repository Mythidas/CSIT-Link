import { sequence } from '@sveltejs/kit/hooks';
import { connect } from "$lib/server/database_v2";
import type { Handle } from '@sveltejs/kit';
import { handle as second } from "$lib/auth";
import { dev } from '$app/environment';
import axios from 'axios';
import https from "https";

export const first: Handle = async({ event, resolve }) => {
  try {
    if (dev) {
      const agent = new https.Agent({ rejectUnauthorized: false });
      axios.defaults.httpsAgent = agent;
    }

    const db_conn = await connect();
    event.locals.db_conn = db_conn;
    const response = await resolve(event);
    db_conn.release();
    return response;
  } catch (err) {
    console.log(err);
    return await resolve(event);
  }
}

export const handle = sequence(first, second);