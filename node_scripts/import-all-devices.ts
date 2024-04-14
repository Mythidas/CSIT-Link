import * as dotenv from "dotenv";
import * as fs from "node:fs/promises";
import * as pg from "pg";

dotenv.config({ path: "../.env.local" });

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
    await fs.appendFile("import-devices.log", `${timestamp} - ${message}\n`);
    console.log(`${timestamp} - ${message}\n`);
  } catch (err) {
    console.log(err);
  }
}

export async function get_sites(client: pg.PoolClient) {
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

async function main() {
  try {
    const start_time = Date.now();

    const pool_client  = await pool.connect();
    await pool_client.query("TRUNCATE TABLE Device RESTART IDENTITY");
    
    const sites = await get_sites(pool_client);

    log(`Obtaining devices for ${sites.length} sites...`);

    for await (const site of sites) {
      const rmm_res = await fetch(`${process.env.LOCAL_URI}/api/external/rmm/devices`, {
        headers: {
          "site-id": site.rmm_id
        }
      });
      const rmm_data = await rmm_res.json();
      if (!rmm_res.ok) {
        log(JSON.stringify(rmm_data));
        return;
      }
      const rmm_devices = rmm_data.data;

      const av_res = await fetch(`${process.env.LOCAL_URI}/api/external/av/devices`, {
        headers: {
          "site-id": site.av_id,
          "site-url": site.av_url
        }
      });
      const av_data = await av_res.json();
      if (!av_res.ok) {
        log(JSON.stringify(av_data));
        return;
      }
      const av_devices = av_data.data;

      let devices: any[] = [];

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
      await log(`Site ${site.title} with ID ${site.site_id}: Collected ${db_devices.length} devices`);
    }

    await log(`Finished in ${(Date.now() - start_time) / 1000 / 60} minutes!`);
    process.exit();
  } catch (err: any) {
    await log(JSON.stringify(err));
    process.exit();
  }
}

main();