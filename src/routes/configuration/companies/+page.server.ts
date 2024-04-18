import * as db from "$lib/server/database";
import { api_response_log } from "$lib/interfaces/i_api_response.js";
import type { Actions } from "./$types.js";
import type { Company, Site } from "$lib/interfaces/i_db.js";

export async function load({ locals }) {
  try {
    const db_companies = await db.get_companies(locals.db_conn);

    return {
      companies: db_companies,
    }
  } catch (err) {
    console.log(err);
  }
}

export const actions = {
  default: async (event) => {
    const form_data = await event.request.formData();

    const company_data: Company = {
      company_id: -1,
      title: form_data.get("title")?.toString() || "",
    }

    if (company_data.title === "") {
      return "Invalid Data";
    }

    if ((await db.add_company(event.locals.db_conn, company_data)).length > 0) {
      return "Site Added";
    } else {
      return "Error adding site";
    }
  }
} satisfies Actions;