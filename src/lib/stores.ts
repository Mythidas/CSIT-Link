import { writable } from "svelte/store";
import type { Site } from "./interfaces/i_db";

export const all_sites = writable<Site[]>([]);