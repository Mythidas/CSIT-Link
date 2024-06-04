import * as db from "$lib/server/database_v2.js";

export async function POST({ request, locals, params }) {
  try {
    const data = await request.json();
    const site = await db.get_site(locals.db_conn, Number(params.slug || -1));
    if (!site) {
      return Response.json({ meta: { error: "Invalid Site in URL", status: 500 }}, { status: 500 });
    }

    let columns = ["de.site_id"], values = [site.site_id.toString()], types = ["Number"];

    for (let i = 0; i < data.filters.length; i++) {
      columns.push(`${data.filters[i].group[0].toLowerCase()}${data.filters[i].group[data.filters[i].group.length - 1].toLowerCase()}.${data.filters[i].key}`);
      values.push(data.filters[i].value);
      types.push(data.filters[i].type);
    }

    const start_index = (data.page - 1) * data.count;
    const devices = await db.get_devices(locals.db_conn, columns, values, types, data.sorting);
    const devices_filtered = devices.slice(start_index, start_index + data.count);

    return Response.json({
      data: devices_filtered,
      meta: {
        status: 200,
        total: devices.length
      }
    }, { status: 200 });
  } catch (err) {
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}