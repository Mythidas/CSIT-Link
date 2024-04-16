import { writable } from "svelte/store";
import type { Site } from "./interfaces/i_db";

export const current_site = writable<Site | null>(null);
export const all_sites = writable<Site[]>([]);