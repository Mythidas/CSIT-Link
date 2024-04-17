import * as dotenv from "dotenv";
import * as fs from "node:fs/promises";
import * as pg from "pg";

dotenv.config({ path: "../.env.local" });
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

interface _ExtDevice {
  id: string,
  site_id: string,
  name: string,
  os: string,
  os_type: "Server" | "Workstation",
  ip_lan: string,
  last_heartbeat: string,
  firewall_enabled: boolean
}

export interface Site {
  site_id: number,
  title: string,
  psa_id: string,
  rmm_id: string,
  av_id: string,
  av_url: string,
  company_id: number,
  last_update: string
}

interface Device {
  id: number,
  title: string,
  site_id: number,
  rmm_id: string,
  av_id: string,
  rmm_last_heartbeat: string,
  av_last_heartbeat: string,
  os_type: "Workstation" | "Server",
  os: string,
  ip_lan: string,
  firewall_enabled: boolean,
  tamp_prot_enabled: boolean
}

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  ssl: !process.env.PG_HOST?.includes("localhost"),
  port: Number(process.env.PG_PORT)
})

async function log(message: string) {
  try {
    const timestamp = new Date().toISOString();
    await fs.appendFile("import_devices.log", `${timestamp} - ${message}\n`);
    console.log(`${timestamp} - ${message}`);
  } catch (err) {
    console.log(err);
  }
}

async function log_dump(message: string) {
  try {
    await fs.appendFile("import_devices_dump.log", `${message}\n`);
  } catch (err) {
    console.log(err);
  }
}

async function clear_dump_logs() {
  try {
    await fs.rm("import_devices_dump.log");
  } catch (err) {
    log(err);
  }
}

async function load_dump_logs() {
  try {
    const file = await fs.readFile("import_devices_dump.log", 'utf-8');
    return JSON.parse(file) as _ExtDevice[];
  } catch (err) {
    log(err);
    return [];
  }
}

export async function get_sites(client: pg.PoolClient): Promise<Site[]> {
  try {
    return (await client.query("SELECT * FROM Site")).rows.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function add_devices_by_site(client: pg.PoolClient, site: number, devices: any[]): Promise<any[]> {
  try {
    if (isNaN(site) || devices.length === 0) {
      return [];
    }

    let args = "";
    let values: any[] = [];

    let arg_count = 1;
    for (let i = 0; i < devices.length; i++) {
      values.push(devices[i].title);
      values.push(devices[i].site_id);
      values.push(devices[i].os);
      values.push(devices[i].rmm_id);
      values.push(devices[i].av_id);
      values.push(devices[i].rmm_last_heartbeat);
      values.push(devices[i].av_last_heartbeat);
      values.push(devices[i].os_type);
      values.push(devices[i].ip_lan);
      values.push(devices[i].firewall_enabled);
      values.push(devices[i].tamp_prot_enabled);
      
      args += `($${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++}, $${arg_count++})`;
      if (i + 1 === devices.length) {
        args += " RETURNING *;";
      } else {
        args += ", "
      }
    }

    const db_devices = (await client.query(`INSERT INTO Device (title, site_id, os, rmm_id, av_id, rmm_last_heartbeat, av_last_heartbeat, os_type, ip_lan, firewall_enabled, tamp_prot_enabled) VALUES ${args}`, values))?.rows || [];
    if (db_devices.length === devices.length) {
      await client.query("UPDATE Site SET last_update = $1 WHERE site_id = $2", [new Date().toISOString(), site.toString()]);
    }

    return db_devices;
  } catch (err) {
    console.log(err);
    return [];
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const rmm_url = "https://centriserve-it.vsax.net/api/v3";
const rmm_auth = btoa(`${process.env.RMM_ID}:${process.env.RMM_SC}`);

async function main() {
  try {
    const start_time = Date.now();

    const pool_client  = await pool.connect();
    const sites = await get_sites(pool_client);
    const all_rmm_devices: _ExtDevice[] = [];
    
    // Get rmm devices
    await log("Obtaining RMM devices...");

    let skip_to = 0;
    while (all_rmm_devices.length < 3500) {
      const asset_api = await fetch(`${rmm_url}/assets?$skip=${skip_to}`, {
        method: "GET",
        headers: {
          "authorization": `Basic ${rmm_auth}`,
          "content-type": "application/json"
        }
      });
      const asset_data = await asset_api.json();
      
      if (!asset_api.ok) {
        await log("Failed to get rmm devices...");
        await log (JSON.stringify(asset_data));
        process.exit();
      }
      
      const device_data = asset_data.Data;
      for (let i = 0; i < device_data.length; i++) {
        all_rmm_devices.push({ 
          id: device_data[i].Identifier,
          site_id: device_data[i].SiteId,
          name: device_data[i].Name, 
          os: device_data[i].Description,
          os_type: device_data[i].GroupName.toLowerCase().includes("server") ? "Server" : "Workstation",
          ip_lan: device_data[i].IpAddresses[0] || "",
          last_heartbeat: device_data[i].LastSeenOnline,
          firewall_enabled: device_data[i].FirewallEnabled
        });
      }
      
      skip_to += device_data.length;
      
      await log(`Obtained ${all_rmm_devices.length} of ${asset_data.Meta.TotalCount} devices...`);
      if (all_rmm_devices.length === asset_data.Meta.TotalCount) {
        break;
      }
    }

    await log(`Obtained ${all_rmm_devices.length} RMM devices...`);
    //await log_dump(JSON.stringify(all_rmm_devices));

    await log("Clearing device table...");
    await pool_client.query("TRUNCATE TABLE Device RESTART IDENTITY");
    
    await log(`Obtaining devices for ${sites.length} sites...`);
    for await (const site of sites) {
      await delay(3000);
      await log(`Starting site ${site.title} with ID ${site.site_id}`);

      const rmm_devices = all_rmm_devices.filter(device => {
        return Number(device.site_id) === Number(site.rmm_id);
      });

      await log(`SiteID: ${site.rmm_id} found ${rmm_devices.length} RMM devices`);
      
      const av_res = await fetch(`${process.env.LOCAL_URI}/api/external/av/devices`, {
        headers: {
          "site-id": site.av_id,
          "site-url": site.av_url
        }
      });
      const av_data = await av_res.json();
      if (!av_res.ok) {
        await log(`Failed to get sophos devices ${site.title}...`);
        await log(JSON.stringify(av_data));
        continue;
      }
      const av_devices = av_data.data;
      await log(`SiteID: ${site.av_id} found ${av_devices.length} AV devices`);

      let devices: Device[] = [];

      for (let i = 0; i < rmm_devices.length; i++) {
        devices.push({ 
          id: -1, 
          title: rmm_devices[i].name, 
          site_id: Number(site.site_id), 
          os: rmm_devices[i].os, 
          rmm_id: rmm_devices[i].id,
          av_id: "",
          rmm_last_heartbeat: rmm_devices[i].last_heartbeat,
          av_last_heartbeat: "",
          os_type: rmm_devices[i].os_type,
          ip_lan: rmm_devices[i].ip_lan,
          firewall_enabled: rmm_devices[i].firewall_enabled,
          tamp_prot_enabled: false
        })
      }

      for (let i = 0; i < av_devices.length; i++) {
        const device = devices.find(dev => dev.title.toLowerCase() === av_devices[i].name.toLowerCase());
        if (device) {
          device.av_id = av_devices[i].id;
          device.tamp_prot_enabled = av_devices[i].firewall_enabled;
          device.av_last_heartbeat = av_devices[i].last_heartbeat;
        } else {
          devices.push({
            id: -1, 
            title: av_devices[i].name, 
            site_id: Number(site.site_id), 
            os: av_devices[i].os, 
            rmm_id: "",
            av_id: av_devices[i].id,
            rmm_last_heartbeat: "",
            av_last_heartbeat: av_devices[i].last_heartbeat,
            os_type: av_devices[i].os_type,
            ip_lan: av_devices[i].ip_lan,
            firewall_enabled: false,
            tamp_prot_enabled: av_devices[i].firewall_enabled
          })
        }
      }

      const db_devices = await add_devices_by_site(pool_client, Number(site.site_id), devices);
      await log(`Completed site ${site.title}: Collected ${db_devices.length} unique devices`);
    }

    await log(`Finished in ${(Date.now() - start_time) / 1000 / 60} minutes!`);
    process.exit();
  } catch (err: any) {
    await log(JSON.stringify(err));
    process.exit();
  }
}

clear_dump_logs();
main();