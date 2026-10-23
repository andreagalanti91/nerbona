/**
 * Compila TUTTI gli agriturismi registrati, uno dopo l'altro.
 * Utile dopo una correzione condivisa: un solo comando ripubblica ogni cliente.
 *
 *   npm run build:all
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const tenants = fs
  .readdirSync("tenants", { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
  .map((entry) => entry.name);

if (!tenants.length) {
  console.error("Nessun cliente trovato in tenants/.");
  process.exit(1);
}

console.log(`Clienti da compilare: ${tenants.join(", ")}\n`);

const failed = [];
for (const siteId of tenants) {
  const result = spawnSync(process.execPath, ["scripts/build-static.mjs"], {
    env: { ...process.env, SITE_ID: siteId },
    stdio: "inherit",
  });
  if (result.status !== 0) failed.push(siteId);
}

console.log("\n─────────────────────────────");
console.log(`Completati: ${tenants.length - failed.length}/${tenants.length}`);
if (failed.length) {
  console.error(`Falliti: ${failed.join(", ")}`);
  process.exit(1);
}
