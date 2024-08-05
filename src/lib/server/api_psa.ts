import { PSA_ID, PSA_SC, PSA_TR, PSA_URL } from "$env/static/private";
import type { Site } from "$lib/interfaces/i_db";
import type { _ExtSite, _PSAContractInfo } from "$lib/interfaces/i_ext_info";
import { Debug } from '$lib/tools/debug';

const debug = new Debug("api_psa");

export async function get_sites(): Promise<_ExtSite[] | null> {
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
      debug.log("get_sites", "Failed to get companies");
      return null;
    }

    for (let i = 0; i < site_data.items.length; i++) {
      site_list.push({ name: site_data.items[i].companyName, id: site_data.items[i].id });
    }
  } catch (err) {
    debug.log("get_sites", err as string);
    return null;
  }

  return site_list;
}

export async function get_contract_unit_info(site: Site): Promise<_PSAContractInfo[] | null> {
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
      debug.log("get_contract_unit_info", "Failed to get contracts");
      return null;
    }

    const contract_ref = contracts_data.items.find((_con: any) => {
      return _con.contractName.includes("Technology") || _con.contractName.includes("Unlimited");
    });

    if (!contract_ref) {
      debug.log("get_contract_unit_info", `No valid contracts found: ${site.title}`);
      return null;
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
      debug.log("get_contract_unit_info", `Failed to get services from contract: ${site.title}`);
      return null;
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
      debug.log("get_contract_unit_info", `Failed to get bundles from contract: ${site.title}`);
      return null;
    }

    const service_bundle_desk_ref = service_bundle_data.items.find((_bundle: any) => {
      return _bundle.internalDescription.includes("CSAB_DESK");
    });

    const service_bundle_serv_ref = service_bundle_data.items.find((_bundle: any) => {
      return _bundle.internalDescription.includes("CSAB_SERV");
    });

    let has_bundles = !(!service_bundle_desk_ref && !service_bundle_serv_ref);

    if (!has_services && !has_bundles) {
      debug.log("get_contract_unit_info", `No valid services or bundles found: ${site.title}`);
      return null;
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
          debug.log("get_contract_unit_info", `Failed to get desk service units: ${site.title}`);
          return null;
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
          debug.log("get_contract_unit_info", `Failed to get serv service units: ${site.title}`);
          return null;
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
  
      return services;
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
          debug.log("get_contract_unit_info", `Failed to get desk service bundle units: ${site.title}`);
          return null;
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
          debug.log("get_contract_unit_info", `Failed to get serv service bundle units: ${site.title}`);
          return null;
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
  
      return bundles;
    }

    return null;
  } catch (err) {
    debug.log("get_contract_unit_info", `${err}: ${site.title}`);
    return null;
  }
}

export async function post_contract_unit_adjustment(site: Site, adjustment: _PSAContractInfo): Promise<number | null> {
  try {
    if (!adjustment.change) {
      debug.log("post_contract_unit_adjustment", `No unit change amount`);
      return null;
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
      debug.log("post_contract_unit_adjustment", `Failed to adjust service bundle`);
      return null;
    }
    
    return adjustment.units + adjustment.change;
  } catch (err) {
    console.log(`[post_contract_unit_adjustment] ${err}`);
    return null;
  }
}