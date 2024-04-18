import * as db from "$lib/server/database";
import type { Actions } from "@sveltejs/kit";

export async function load({ locals, url }) {
  try {
    const db_patches = await db.get_patches(locals.db_conn);

    return {
      patches: db_patches
    }
  } catch (err) {
    console.log(err);
  }
}

export const actions = {
  default: async (event) => {
    const form_data = await event.request.formData();

    const title = form_data.get("title")?.toString();
    const description = form_data.get("description")?.toString();
    const app_ver = form_data.get("app_ver")?.toString();

    if (!title || !description || !app_ver) return null;

    //return (await db.add_patch(event.locals.db_conn, { id: -1, title: title, description: description, app_ver: app_ver }));
  }
} satisfies Actions;