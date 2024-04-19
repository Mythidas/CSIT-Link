// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import pg from "pg";
import ldap from "ldapjs";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      db_conn: pg.PoolClient;
    }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
