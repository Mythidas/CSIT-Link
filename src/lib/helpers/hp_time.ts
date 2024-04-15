import type { CellData, SortState } from "$lib/components/table/filtered_table.svelte";

export function get_time_since(date_string: string): string {
  const date = new Date(date_string);
  const now = new Date();
  const diff_in_seconds = (now.getTime() - date.getTime()) / 1000;

  if (diff_in_seconds >= 86400) { // Check if at least a day has passed
    const days_ago = Math.floor(diff_in_seconds / 86400);
    return `${days_ago} days ago`;
  } else if (diff_in_seconds <= 600) {
    return "Now";
  } else if(isNaN(diff_in_seconds)) {
    return "Never"
  } else if (diff_in_seconds >= 3600) {
    const hours_ago = Math.floor(diff_in_seconds / 3600);
    return `${hours_ago} hours ago`; 
  } else {
    const minutes_ago = Math.floor(diff_in_seconds / 60);
    return `${minutes_ago} minutes ago`;
  }
}

export function time_since_sort(a: CellData, b: CellData, state: SortState): number {
  const prio = (date: string) => {
    if (date === "Now") {
      return 1;
    } else if (date.includes("minutes")) {
      return 2;
    } else if (date.includes("hours")) {
      return 3;
    } else if (date.includes("days")) {
      return 4;
    } else {
      return 5;
    }
  }

  if (prio(a.value) < prio(b.value)) return state.dir === "asc" ? -1 : 1;
  if (prio(a.value) > prio(b.value)) return state.dir === "desc" ? -1 : 1;
  
  if (a.value !== "Now" && a.value !== "Never") {
    return parseInt(a.value) - parseInt(b.value);
  }

  return 0;
}