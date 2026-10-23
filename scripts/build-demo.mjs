/**
 * COMPILA UNA DEMO COMMERCIALE
 * ============================
 *
 *   SITE_ID=nerbona npm run demo:build
 *
 * Compila il cliente per l'indirizzo di anteprima
 *
 *   https://andreagalanti.it/demo/<cliente>
 *
 * e rigenera la pagina indice che elenca tutte le demo esistenti, così hai
 * sempre un portfolio pronto da mandare via email.
 *
 * Il risultato sta in dist/demo/. Si carica una volta sola: le demo già
 * pubblicate non vengono toccate finché non le ricompili.
 *
 * L'indirizzo di base si cambia con DEMO_ORIGIN e DEMO_PATH.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const id = process.env.SITE_ID;
if (!id) {
  console.error("\nUso: SITE_ID=<cliente> npm run demo:build\n");
  process.exit(1);
}

const origin = process.env.DEMO_ORIGIN ?? "https://andreagalanti.it";
const demoPath = process.env.DEMO_PATH ?? "/demo";
const basePath = `${demoPath}/${id}`;

console.log(`\nDemo: ${origin}${basePath}\n`);

const result = spawnSync(process.execPath, ["scripts/build-static.mjs"], {
  env: {
    ...process.env,
    SITE_ID: id,
    BASE_PATH: basePath,
    /* L'anteprima vive sul dominio di lavoro, non su quello del cliente,
       e non deve finire nei motori di ricerca. */
    SITE_URL: `${origin}${basePath}`,
    NOINDEX: "true",
  },
  stdio: "inherit",
});
if (result.status !== 0) process.exit(result.status ?? 1);

/* Sposta la build sotto dist/demo/<id>/ e lascia intatte le altre. */
const demoRoot = path.join("dist", "demo");
const target = path.join(demoRoot, id);
fs.mkdirSync(demoRoot, { recursive: true });
fs.rmSync(target, { recursive: true, force: true });
fs.renameSync(path.join("dist", id), target);

/* --- pagina indice ------------------------------------------------ */

/* Elenca le demo effettivamente presenti nella cartella, leggendo il titolo
   dall'HTML già generato: nessun elenco da tenere aggiornato a mano. */
const demos = fs
  .readdirSync(demoRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => {
    const html = path.join(demoRoot, e.name, "index.html");
    const source = fs.existsSync(html) ? fs.readFileSync(html, "utf8") : "";
    const title = source.match(/<title>([^<]*)<\/title>/)?.[1] ?? e.name;
    const description = source.match(/name="description" content="([^"]*)"/)?.[1] ?? "";
    return { id: e.name, title: title.split("|")[0].trim(), description };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

fs.writeFileSync(
  path.join(demoRoot, "index.html"),
  `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Pagina di lavoro: non deve finire nei motori di ricerca. -->
<meta name="robots" content="noindex, nofollow">
<title>Anteprime</title>
<style>
  :root { --ink:#17231c; --cream:#f2eee4; --line:rgba(23,35,28,.18); }
  * { box-sizing:border-box }
  body { margin:0; padding:12vh 6vw; background:var(--cream); color:var(--ink);
         font:16px/1.6 Arial, Helvetica, sans-serif; }
  h1 { font:400 clamp(28px,5vw,44px)/1.1 Georgia, serif; margin:0 0 8px }
  p.lead { margin:0 0 48px; opacity:.65; max-width:52ch }
  ul { list-style:none; margin:0; padding:0; display:grid; gap:1px;
       background:var(--line); border-block:1px solid var(--line) }
  li { background:var(--cream) }
  a { display:block; padding:26px 4px; color:inherit; text-decoration:none;
      display:flex; gap:20px; align-items:baseline; flex-wrap:wrap }
  a:hover { background:#fff }
  b { font:400 22px/1.2 Georgia, serif; flex:0 0 auto }
  span { opacity:.6; font-size:14px; flex:1 1 240px }
  em { font-style:normal; opacity:.4; font-size:13px; letter-spacing:.08em;
       text-transform:uppercase }
  footer { margin-top:56px; opacity:.4; font-size:13px }
</style>
</head>
<body>
  <h1>Anteprime</h1>
  <p class="lead">Siti dimostrativi. I contenuti sono provvisori e servono solo a mostrare l'impostazione grafica.</p>
  <ul>
${demos
  .map(
    (d) =>
      `    <li><a href="${demoPath}/${d.id}/"><b>${escape(d.title)}</b><span>${escape(d.description)}</span><em>apri</em></a></li>`,
  )
  .join("\n")}
  </ul>
  <footer>Aggiornato il ${new Date().toLocaleDateString("it-IT")}</footer>
</body>
</html>
`,
);

console.log(`
Demo pronte: ${demos.length}

  Carica il contenuto di dist/demo/ dentro la cartella "demo" del dominio.

  ${origin}${demoPath}/            elenco di tutte le anteprime
  ${origin}${basePath}/${" ".repeat(Math.max(0, 12 - id.length))} questa demo
`);
