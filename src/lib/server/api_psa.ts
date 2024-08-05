import { PSA_ID, PSA_SC, PSA_TR, PSA_URL } from "$env/static/private";
import type { APIResponse } from "$lib/interfaces/i_api_response";
import type { Site } from "$lib/interfaces/i_db";
import type { _PSAContractInfo } from "$lib/interfaces/i_ext_info";
import * as db from "$lib/server/database_v2";

export async function get_sites(): Promise<APIResponse> {
  let site_list: any[] = [];

  try {
    const site_api = await fetch(`${PSA_URL}/Companies/query?search={"Filter":[{"field":"Id","op":"gte","value":0},{"field":"companyType","op":"eq","value":1},{"field":"isActive","op":"eq","value":true}]}`, {
      method: "GET",
      headers: {
        "APIIntegrationcode": PSA_TR,
        "UserName": PSA_ID,
        "Secret": PSA_SC,
        "Content-Type": "application/json"
      }
    });
    const site_data = await site_api.json();

    if (!site_api.ok) {
      return { meta: { error: site_data, status: 500 }};
    }

    for (let i = 0; i < site_data.items.length; i++) {
      site_list.push({ name: site_data.items[i].companyName, id: site_data.items[i].id });
    }
  } catch (err) {
    console.log(err);
    return { meta: { error: err, status: 500 } };
  }

  return { data: site_list, meta: { status: 200 }};
}

export async function get_contract_unit_info(site: Site): Promise<APIResponse> {
  try {
    const contracts_api = await fetch(`${PSA_URL}/Contracts/query?search={"Filter":[{"field":"companyID","op":"eq","value":${site.psa_id}},{"field":"endDate","op":"gt","value":"${new Date().toDateString()}"}]}`, {
      method: "GET",
      headers: {
        "APIIntegrationcode": PSA_TR,
        "UserName": PSA_ID,
        "Secret": PSA_SC,
        "Content-Type": "application/json"
      }
    });
    const contracts_data = await contracts_api.json();

    if (!contracts_api.ok) {
      console.log(`[get_contract_unit_info] Failed to get contracts`);
      return { meta: { error: contracts_data, status: 500 } };
    }

    const contract_ref = contracts_data.items.find((_con: any) => {
      return _con.contractName.includes("Technology") || _con.contractName.includes("Unlimited");
    });

    if (!contract_ref) {
      console.log(`[get_contract_unit_info] No valid contracts found: ${site.title}`);
      return { meta: { error: "No valid contracts found", status: 500 } };
    }

    // Get Services

    const service_api = await fetch(`${PSA_URL}/ContractServices/query?search={"Filter":[{"field":"contractID","op":"eq","value":${contract_ref.id}}]}`, {
      method: "GET",
      headers: {
        "APIIntegrationcode": PSA_TR,
        "UserName": PSA_ID,
        "Secret": PSA_SC,
        "Content-Type": "application/json"
      }
    });
    const service_data = await service_api.json();

    if (!service_api.ok) {
      console.log(`[get_contract_unit_info] Failed to get services from contract: ${site.title}`);
      return { meta: { error: service_data.errors[0], status: 500 } };
    }

    const service_desk_ref = service_data.items.find((_service: any) => {
      return _service.internalDescription.includes("CSAB_DESK");
    });

    const service_serv_ref = service_data.items.find((_service: any) => {
      return _service.internalDescription.includes("CSAB_SERV");
    });

    let has_services = !(!service_desk_ref && !service_serv_ref);

    // Get Service Bundles

    const service_bundle_api = await fetch(`${PSA_URL}/ContractServiceBundles/query?search={"Filter":[{"field":"contractID","op":"eq","value":${contract_ref.id}}]}`, {
      method: "GET",
      headers: {
        "APIIntegrationcode": PSA_TR,
        "UserName": PSA_ID,
        "Secret": PSA_SC,
        "Content-Type": "application/json"
      }
    });
    const service_bundle_data = await service_bundle_api.json();

    if (!service_bundle_api.ok) {
      console.log(`[get_contract_unit_info] Failed to get bundles from contract: ${site.title}`);
      return { meta: { error: service_bundle_data.errors[0], status: 500 } };
    }

    const service_bundle_desk_ref = service_bundle_data.items.find((_bundle: any) => {
      return _bundle.internalDescription.includes("CSAB_DESK");
    });

    const service_bundle_serv_ref = service_bundle_data.items.find((_bundle: any) => {
      return _bundle.internalDescription.includes("CSAB_SERV");
    });

    let has_bundles = !(!service_bundle_desk_ref && !service_bundle_serv_ref);

    if (!has_services && !has_bundles) {
      console.log(`[get_contract_unit_info] No valid services or bundles found: ${site.title}`);
      return { meta: { error: `No valid services or bundles found: ${site.title}`, status: 500 } };
    }

    if (has_services) {
      const services: _PSAContractInfo[] = [];
      if (service_desk_ref) {
        // Desk Service
        const desk_service_units_api = await fetch(`${PSA_URL}/ContractServiceUnits/query?search={"Filter":[{"field":"contractID","op":"eq","value":${contract_ref.id}},{"field":"serviceID","op":"eq","value":${service_desk_ref.serviceID}},{"field":"endDate","op":"gte","value":"${new Date().toDateString()}"},{"field":"startDate","op":"lte","value":"${new Date().toDateString()}"}]}`, {
          method: "GET",
          headers: {
            "APIIntegrationcode": PSA_TR,
            "UserName": PSA_ID,
            "Secret": PSA_SC,
            "Content-Type": "application/json"
          }
        });
        const desk_service_units_data = await desk_service_units_api.json();
    
        if (!desk_service_units_api.ok || desk_service_units_data.items.length <= 0) {
          console.log(`[get_contract_unit_info] Failed to get desk service units: ${site.title}`);
          return { meta: { error: desk_service_units_data, status: 500 } };
        }

        const desk_service: _PSAContractInfo = {
          units: desk_service_units_data.items[0].units,
          psa_contract_id: contract_ref.id,
          psa_service_id: service_desk_ref.serviceID,
          psa_service_type: "SERVICE",
          psa_service_desc: "CSAB_DESK"
        }
        services.push(desk_service);
      }

      if (service_serv_ref) {
        // Serv Service
        const serv_service_units_api = await fetch(`${PSA_URL}/ContractServiceUnits/query?search={"Filter":[{"field":"contractID","op":"eq","value":${contract_ref.id}},{"field":"serviceID","op":"eq","value":${service_serv_ref.serviceID}},{"field":"endDate","op":"gte","value":"${new Date().toDateString()}"},{"field":"startDate","op":"lte","value":"${new Date().toDateString()}"}]}`, {
          method: "GET",
          headers: {
            "APIIntegrationcode": PSA_TR,
            "UserName": PSA_ID,
            "Secret": PSA_SC,
            "Content-Type": "application/json"
          }
        });
        const serv_service_units_data = await serv_service_units_api.json();
    
        if (!serv_service_units_api.ok || serv_service_units_data.items.length <= 0) {
          console.log(`[get_contract_unit_info] Failed to get serv service units: ${site.title}`);
          return { meta: { error: serv_service_units_data, status: 500 } };
        }

        const serv_service: _PSAContractInfo = {
          units: serv_service_units_data.items[0].units,
          psa_contract_id: contract_ref.id,
          psa_service_id: service_serv_ref.serviceID,
          psa_service_type: "SERVICE",
          psa_service_desc: "CSAB_SERV"
        }
        services.push(serv_service);
      }
  
      return {
        data: services,
        meta: {
          status: 200
        }
      }
    }
    
    if (has_bundles) {
      const bundles: _PSAContractInfo[] = [];

      if (service_bundle_desk_ref) {
        // Desk Bundle
        const desk_bundle_units_api = await fetch(`${PSA_URL}/ContractServiceBundleUnits/query?search={"Filter":[{"field":"contractID","op":"eq","value":${contract_ref.id}},{"field":"serviceBundleID","op":"eq","value":${service_bundle_desk_ref.serviceBundleID}},{"field":"endDate","op":"gte","value":"${new Date().toDateString()}"},{"field":"startDate","op":"lte","value":"${new Date().toDateString()}"}]}`, {
          method: "GET",
          headers: {
            "APIIntegrationcode": PSA_TR,
            "UserName": PSA_ID,
            "Secret": PSA_SC,
            "Content-Type": "application/json"
          }
        });
        const desk_bundle_units_data = await desk_bundle_units_api.json();
    
        if (!desk_bundle_units_api.ok || desk_bundle_units_data.items.length <= 0) {
          console.log(`[get_contract_unit_info] Failed to get service bundle units: ${site.title}`);
          return { meta: { error: desk_bundle_units_data, status: 500 } };
        }

        const desk_bundle: _PSAContractInfo = {
          units: desk_bundle_units_data.items[0].units,
          psa_contract_id: contract_ref.id,
          psa_service_id: service_bundle_desk_ref.serviceBundleID,
          psa_service_type: "BUNDLE",
          psa_service_desc: "CSAB_DESK"
        }
        bundles.push(desk_bundle);
      }

      if (service_bundle_serv_ref) {
        // Serv Bundle
        const serv_bundle_units_api = await fetch(`${PSA_URL}/ContractServiceBundleUnits/query?search={"Filter":[{"field":"contractID","op":"eq","value":${contract_ref.id}},{"field":"serviceBundleID","op":"eq","value":${service_bundle_serv_ref.serviceBundleID}},{"field":"endDate","op":"gte","value":"${new Date().toDateString()}"},{"field":"startDate","op":"lte","value":"${new Date().toDateString()}"}]}`, {
          method: "GET",
          headers: {
            "APIIntegrationcode": PSA_TR,
            "UserName": PSA_ID,
            "Secret": PSA_SC,
            "Content-Type": "application/json"
          }
        });
        const serv_bundle_units_data = await serv_bundle_units_api.json();
    
        if (!serv_bundle_units_api.ok || serv_bundle_units_data.items.length <= 0) {
          console.log(`[get_contract_unit_info] Failed to get service bundle units: ${site.title}`);
          return { meta: { error: serv_bundle_units_data, status: 500 } };
        }

        const serv_bundle: _PSAContractInfo = {
          units: serv_bundle_units_data.items[0].units,
          psa_contract_id: contract_ref.id,
          psa_service_id: service_bundle_serv_ref.serviceBundleID,
          psa_service_type: "BUNDLE",
          psa_service_desc: "CSAB_SERV"
        }
        bundles.push(serv_bundle);
      }
  
      return {
        data: bundles,
        meta: {
          status: 200
        }
      }
    }

    return { meta: { error: `Failed to get services or bundles: ${site.title}`, status: 500 } };
  } catch (err) {
    console.log(`[get_contract_unit_info] ${err}: ${site.title}`);
    return { meta: { error: `${err}`, status: 500 } };
  }
}

export async function post_contract_unit_adjustment(site: Site, adjustment: _PSAContractInfo): Promise<APIResponse> {
  try {
    if (!adjustment.change) {
      console.log(`[post_contract_unit_adjustment] No unit change amount`);
      return { meta: { error: `No unit change amount`, status: 500 } };
    }

    const unit_adjust_api = await fetch(`${PSA_URL}/ContractServiceBundleAdjustments`, {
      method: "POST",
      headers: {
        "APIIntegrationcode": PSA_TR,
        "UserName": PSA_ID,
        "Secret": PSA_SC,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contractID: adjustment.psa_contract_id,
        serviceBundleID: adjustment.psa_service_id,
        unitChange: adjustment.change
      })
    });
    const unit_adjust_data = await unit_adjust_api.json();

    if (!unit_adjust_api.ok) {
      console.log(`[post_contract_unit_adjustment] Failed to adjust service bundle`);
      return { meta: { error: unit_adjust_data.errors[0], status: 500 } };
    }
    
    return { data: adjustment.units + adjustment.change, meta: { status: 200 } };
  } catch (err) {
    console.log(`[post_contract_unit_adjustment] ${err}`);
    return { meta: { error: `${err}`, status: 500 } };
  }
}