// Runs probe.html (written by build.mjs) in headless Chrome through the skill's drive.mjs and
// writes probe.json: the layer slot of every fragment and the overlaps that decided it.
//   node probe.mjs
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DRIVE = ((process.env.ANATOMY_ASSET_DIR ?? `${process.env.USERPROFILE ?? process.env.HOME}/.claude/skills/anatomy-asset`).replace(/[\\/]?$/, "/")) + "scripts/drive.mjs";
const actions = join(HERE, "probe.actions.json");
writeFileSync(actions, JSON.stringify([["wait", 300], ["eval", "window.__probe()"]]));
const out = execFileSync(process.execPath, [DRIVE, join(HERE, "probe.html"), "--actions", actions, "--width", "800", "--height", "600"], { encoding: "utf8", maxBuffer: 64 << 20 });
const line = out.split("\n").find((l) => l.startsWith("eval: "));
if (!line) { console.log(out); process.exit(1); }
const res = JSON.parse(JSON.parse(line.slice(6)));
writeFileSync(join(HERE, "probe.json"), JSON.stringify(res, null, 1));
for (const r of res.result) console.log(String(r.slot).padStart(2), r.moving ? "MOVE" : "    ", r.name.padEnd(22), String(r.px).padStart(7), JSON.stringify(r.hits));
console.log("lifted:", res.lifted.join(" ") || "none");
console.log("order violations:", res.bad.length ? res.bad.join("; ") : "0");
if (res.bad.length) process.exit(1);
