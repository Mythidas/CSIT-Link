import * as ldap from "ldapjs";

export const connect = async () => {
  const client = ldap.createClient({
    url: ["ldap://dc01.csit.loc"]
  })

  client.bind("", "", (err) => {
    console.log(err);
  })
}