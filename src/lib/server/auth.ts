import { AUTH_SC, LDAP_URL } from "$env/static/private";
import ldap from "ldapjs";
import jwt from "jsonwebtoken";

export async function validate(username: string, password: string) {
  try {
    return new Promise<boolean>((resolve, reject) => {
      const client = ldap.createClient({
        url: LDAP_URL
      });

      client.on("error", (err) => {
        if (err.errno === -4077) return;
        console.log(err);
      });

      client.bind(`${username}@csit.loc`, password, (err, bnd) => {
        resolve(err === null);
      });
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}

export function generate_token(username: string) {
  const payload = { username };
  const token = jwt.sign(payload, AUTH_SC, { expiresIn: "4h" });
  return token;
}