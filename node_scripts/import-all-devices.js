"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_devices_by_site = exports.get_sites = void 0;
var dotenv = require("dotenv");
var fs = require("node:fs/promises");
var pg = require("pg");
dotenv.config({ path: "../.env.local" });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var pool = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    ssl: !((_a = process.env.PG_HOST) === null || _a === void 0 ? void 0 : _a.includes("localhost")),
    port: Number(process.env.PG_PORT)
});
function log(message) {
    return __awaiter(this, void 0, void 0, function () {
        var timestamp, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    timestamp = new Date().toISOString();
                    return [4 /*yield*/, fs.appendFile("import_devices.log", "".concat(timestamp, " - ").concat(message, "\n"))];
                case 1:
                    _a.sent();
                    console.log("".concat(timestamp, " - ").concat(message));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function log_dump(message) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.appendFile("import_devices_dump.log", "".concat(message, "\n"))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function clear_dump_logs() {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.rm("import_devices_dump.log")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    log(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function load_dump_logs() {
    return __awaiter(this, void 0, void 0, function () {
        var file, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile("import_devices_dump.log", 'utf-8')];
                case 1:
                    file = _a.sent();
                    console.log(file);
                    return [2 /*return*/, JSON.parse(file)];
                case 2:
                    err_4 = _a.sent();
                    log(err_4);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function get_sites(client) {
    return __awaiter(this, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.query("SELECT * FROM Site")];
                case 1: return [2 /*return*/, (_a.sent()).rows.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()); })];
                case 2:
                    err_5 = _a.sent();
                    console.log(err_5);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.get_sites = get_sites;
function add_devices_by_site(client, site, devices) {
    return __awaiter(this, void 0, void 0, function () {
        var args, values, arg_count, i, db_devices, err_6;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    if (isNaN(site) || devices.length === 0) {
                        return [2 /*return*/, []];
                    }
                    args = "";
                    values = [];
                    arg_count = 1;
                    for (i = 0; i < devices.length; i++) {
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
                        args += "($".concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ", $").concat(arg_count++, ")");
                        if (i + 1 === devices.length) {
                            args += " RETURNING *;";
                        }
                        else {
                            args += ", ";
                        }
                    }
                    return [4 /*yield*/, client.query("INSERT INTO Device (title, site_id, os, rmm_id, av_id, rmm_last_heartbeat, av_last_heartbeat, os_type, ip_lan, firewall_enabled, tamp_prot_enabled) VALUES ".concat(args), values)];
                case 1:
                    db_devices = ((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.rows) || [];
                    if (!(db_devices.length === devices.length)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client.query("UPDATE Site SET last_update = $1 WHERE site_id = $2", [new Date().toISOString(), site.toString()])];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/, db_devices];
                case 4:
                    err_6 = _b.sent();
                    console.log(err_6);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.add_devices_by_site = add_devices_by_site;
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var rmm_url = "https://centriserve-it.vsax.net/api/v3";
var rmm_auth = btoa("".concat(process.env.RMM_ID, ":").concat(process.env.RMM_SC));
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var start_time, pool_client, sites, all_rmm_devices, skip_to, asset_api, asset_data, device_data, i, _loop_1, _a, sites_1, sites_1_1, e_1_1, err_7;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 31, , 33]);
                    start_time = Date.now();
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    pool_client = _e.sent();
                    return [4 /*yield*/, get_sites(pool_client)];
                case 2:
                    sites = _e.sent();
                    return [4 /*yield*/, load_dump_logs()];
                case 3:
                    all_rmm_devices = _e.sent();
                    // Get rmm devices
                    return [4 /*yield*/, log("Obtaining RMM devices...")];
                case 4:
                    // Get rmm devices
                    _e.sent();
                    if (!(all_rmm_devices.length < 0)) return [3 /*break*/, 12];
                    skip_to = 0;
                    _e.label = 5;
                case 5:
                    if (!(all_rmm_devices.length < 3500)) return [3 /*break*/, 12];
                    return [4 /*yield*/, fetch("".concat(rmm_url, "/assets?$skip=").concat(skip_to), {
                            method: "GET",
                            headers: {
                                "authorization": "Basic ".concat(rmm_auth),
                                "content-type": "application/json"
                            }
                        })];
                case 6:
                    asset_api = _e.sent();
                    return [4 /*yield*/, asset_api.json()];
                case 7:
                    asset_data = _e.sent();
                    if (!!asset_api.ok) return [3 /*break*/, 10];
                    return [4 /*yield*/, log("Failed to get rmm devices...")];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, log(JSON.stringify(asset_data))];
                case 9:
                    _e.sent();
                    process.exit();
                    _e.label = 10;
                case 10:
                    device_data = asset_data.Data;
                    for (i = 0; i < device_data.length; i++) {
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
                    return [4 /*yield*/, log("Obtained ".concat(all_rmm_devices.length, " of ").concat(asset_data.Meta.TotalCount, " devices..."))];
                case 11:
                    _e.sent();
                    if (all_rmm_devices.length === asset_data.Meta.TotalCount) {
                        return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 5];
                case 12: return [4 /*yield*/, log("Obtained ".concat(all_rmm_devices.length, " RMM devices..."))];
                case 13:
                    _e.sent();
                    //await log_dump(JSON.stringify(all_rmm_devices));
                    return [4 /*yield*/, log("Clearing device table...")];
                case 14:
                    //await log_dump(JSON.stringify(all_rmm_devices));
                    _e.sent();
                    return [4 /*yield*/, pool_client.query("TRUNCATE TABLE Device RESTART IDENTITY")];
                case 15:
                    _e.sent();
                    return [4 /*yield*/, log("Obtaining devices for ".concat(sites.length, " sites..."))];
                case 16:
                    _e.sent();
                    _e.label = 17;
                case 17:
                    _e.trys.push([17, 23, 24, 29]);
                    _loop_1 = function () {
                        var site, rmm_devices, av_res, av_data, av_devices, devices, i, _loop_2, i, db_devices;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _d = sites_1_1.value;
                                    _a = false;
                                    site = _d;
                                    return [4 /*yield*/, delay(3000)];
                                case 1:
                                    _f.sent();
                                    return [4 /*yield*/, log("Starting site ".concat(site.title, " with ID ").concat(site.site_id))];
                                case 2:
                                    _f.sent();
                                    rmm_devices = all_rmm_devices.filter(function (device) {
                                        if (site.rmm_id === "110") {
                                            console.log(Number(device.site_id) === Number(site.rmm_id));
                                        }
                                        return Number(device.site_id) === Number(site.rmm_id);
                                    });
                                    return [4 /*yield*/, log("SiteID: ".concat(site.rmm_id, " found ").concat(rmm_devices.length, " RMM devices"))];
                                case 3:
                                    _f.sent();
                                    return [4 /*yield*/, fetch("".concat(process.env.LOCAL_URI, "/api/external/av/devices"), {
                                            headers: {
                                                "site-id": site.av_id,
                                                "site-url": site.av_url
                                            }
                                        })];
                                case 4:
                                    av_res = _f.sent();
                                    return [4 /*yield*/, av_res.json()];
                                case 5:
                                    av_data = _f.sent();
                                    if (!!av_res.ok) return [3 /*break*/, 8];
                                    return [4 /*yield*/, log("Failed to get sophos devices ".concat(site.title, "..."))];
                                case 6:
                                    _f.sent();
                                    return [4 /*yield*/, log(JSON.stringify(av_data))];
                                case 7:
                                    _f.sent();
                                    return [2 /*return*/, "continue"];
                                case 8:
                                    av_devices = av_data.data;
                                    return [4 /*yield*/, log("SiteID: ".concat(site.av_id, " found ").concat(av_devices.length, " AV devices"))];
                                case 9:
                                    _f.sent();
                                    devices = [];
                                    for (i = 0; i < rmm_devices.length; i++) {
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
                                        });
                                    }
                                    _loop_2 = function (i) {
                                        var device = devices.find(function (dev) { return dev.title.toLowerCase() === av_devices[i].name.toLowerCase(); });
                                        if (device) {
                                            device.av_id = av_devices[i].id;
                                            device.tamp_prot_enabled = av_devices[i].firewall_enabled;
                                            device.av_last_heartbeat = av_devices[i].last_heartbeat;
                                        }
                                        else {
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
                                            });
                                        }
                                    };
                                    for (i = 0; i < av_devices.length; i++) {
                                        _loop_2(i);
                                    }
                                    return [4 /*yield*/, add_devices_by_site(pool_client, Number(site.site_id), devices)];
                                case 10:
                                    db_devices = _f.sent();
                                    return [4 /*yield*/, log("Completed site ".concat(site.title, ": Collected ").concat(db_devices.length, " unique devices"))];
                                case 11:
                                    _f.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = true, sites_1 = __asyncValues(sites);
                    _e.label = 18;
                case 18: return [4 /*yield*/, sites_1.next()];
                case 19:
                    if (!(sites_1_1 = _e.sent(), _b = sites_1_1.done, !_b)) return [3 /*break*/, 22];
                    return [5 /*yield**/, _loop_1()];
                case 20:
                    _e.sent();
                    _e.label = 21;
                case 21:
                    _a = true;
                    return [3 /*break*/, 18];
                case 22: return [3 /*break*/, 29];
                case 23:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 29];
                case 24:
                    _e.trys.push([24, , 27, 28]);
                    if (!(!_a && !_b && (_c = sites_1.return))) return [3 /*break*/, 26];
                    return [4 /*yield*/, _c.call(sites_1)];
                case 25:
                    _e.sent();
                    _e.label = 26;
                case 26: return [3 /*break*/, 28];
                case 27:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 28: return [7 /*endfinally*/];
                case 29: return [4 /*yield*/, log("Finished in ".concat((Date.now() - start_time) / 1000 / 60, " minutes!"))];
                case 30:
                    _e.sent();
                    process.exit();
                    return [3 /*break*/, 33];
                case 31:
                    err_7 = _e.sent();
                    return [4 /*yield*/, log(JSON.stringify(err_7))];
                case 32:
                    _e.sent();
                    process.exit();
                    return [3 /*break*/, 33];
                case 33: return [2 /*return*/];
            }
        });
    });
}
//clear_dump_logs();
main();
