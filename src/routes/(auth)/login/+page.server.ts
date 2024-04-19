import type { Actions } from "@sveltejs/kit";
import { dev } from "$app/environment";
import * as auth from "$lib/server/auth";
import * as db from "$lib/server/database";

export const actions = {
  default: async ({ locals, cookies, request }) => {
    try {
      const form_data = await request.formData();

      const username = form_data.get("username")?.toString() || "";
      const password = form_data.get("password")?.toString() || "";

      let result = await auth.validate(username, password);
      const token = auth.generate_token(username);
      
      if (result) {
        cookies.set("auth_token", token, {
          path: "/",
          maxAge: 3600,
          httpOnly: true,
          secure: !dev,
          sameSite: "strict"
        });

        result = await db.set_auth(locals.db_conn, username, token);
      }

      return { success: result };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }
} satisfies Actions;