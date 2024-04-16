import type { CellData, SortState } from "$lib/components/table/filtered_table.svelte";

export function boolean_sort_with_invalid(a: CellData, b: CellData, state: SortState): number {
  const prio = (val: string) => {
    switch (val) {
      case "YES": return 1;
      case "NO": return 2;
      default: return 3;
    }
  }

  if (prio(a.value) < prio(b.value)) return state.dir === "asc" ? -1 : 1;
  if (prio(a.value) > prio(b.value)) return state.dir === "desc" ? -1 : 1;
  return 0;
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