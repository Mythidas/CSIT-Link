import type { ABHistory, Site } from "$lib/interfaces/i_db.js";
import * as db from "$lib/server/database_v2.js";
import * as psa from "$lib/server/api_psa.js";
import * as rmm from "$lib/server/api_rmm.js";
import type { _VSAxDevice } from "$lib/interfaces/i_ext_info.js";

export async function GET({ request, locals }) {
  try {
    const db_sites = await db.get_sites(locals.db_conn, [], [], [], { key: "", group: "", asc: true, type: "" });

    let adjustment_list: ABHistory[] = [];
    for await (const site of db_sites) {
      try {
        const unit_info = await psa.get_contract_unit_info(site);
        if (!unit_info) continue;

        const rmm_devices = await rmm.get_devices(site.rmm_id);
        if (!rmm_devices) {
          console.log(`[API/V2/Autobill/Sync/GET] Failed to get RMM Devices`);
          continue;
        }

        const server_count = rmm_devices.filter((_comp: _VSAxDevice) => {
          return _comp.Description.includes("Server");
        }).length;
        const desktop_count = rmm_devices.length - server_count;
        
        if ((desktop_count <= 0 && server_count <= 0)) {
          console.log(`[API/V2/Autobill/Sync/GET] Failed to get Desktop & Server Devices`);
          continue;
        }

        for (const _adj of unit_info) {
          if (_adj.psa_service_desc === "CSAB_DESK") {
            if (_adj.units !== desktop_count) {
              adjustment_list.push({
                id: -1,
                site_id: site.site_id,
                prev_count: _adj.units,
                new_count: desktop_count,
                psa_contract_id: _adj.psa_contract_id,
                psa_service_id: _adj.psa_service_id,
                psa_service_type: _adj.psa_service_type,
                psa_service_desc: _adj.psa_service_desc
              });
            }
          } else {
            if (_adj.units !== server_count) {
              adjustment_list.push({
                id: -1,
                site_id: site.site_id,
                prev_count: _adj.units,
                new_count: server_count,
                psa_contract_id: _adj.psa_contract_id,
                psa_service_id: _adj.psa_service_id,
                psa_service_type: _adj.psa_service_type,
                psa_service_desc: _adj.psa_service_desc
              });
            }
          }
        }
      } catch (err) {
        console.log(`[API/V2/Autobill/Sync/GET] ${err}`);
        continue;
      }
    }

    return Response.json({ data: { adjustments: adjustment_list }, meta: { status: 200 } }, { status: 200 });
  } catch (err) {
    console.log(`[API/V2/Autobill/Sync/GET] ${err}`);
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}

export async function POST({ request, locals }) {
  try {
    const data = await request.json();

    const db_sites = await db.get_sites(locals.db_conn, [], [], [], { key: "", group: "", asc: true, type: "" });
    const unit_info = await psa.get_contract_unit_info(db_sites[0]);
    //const ab_history = await db.post_ab_history_adjustment(locals.db_conn, db_sites[0].site_id, unit_info.data);

    return Response.json({ data: unit_info, meta: { status: 200 } }, { status: 200 });
  } catch (err) {
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}