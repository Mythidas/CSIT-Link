import * as db from "$lib/server/database_v2";

export async function load({ locals, cookies, parent }) {
  try {
    const { sites } = await parent();

    const sites_mismatched = sites.filter((_site) => {
      return _site.av_count !== _site.rmm_count;
    })

    return {
      sites_mismatched
    }
  } catch (err) {
    console.log(err);
    return {};
  }
}