// Loads all texts from the /texts folder.
// texts/site.yml -> t.site, texts/home.yml -> t.home, texts/cases/x.yml -> t.cases.x
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const root = path.resolve("texts");

function load(file) {
  return yaml.load(fs.readFileSync(file, "utf8"));
}

export default function () {
  const t = { cases: {} };
  for (const f of fs.readdirSync(root)) {
    if (f.endsWith(".yml")) t[f.replace(/\.yml$/, "")] = load(path.join(root, f));
  }
  const casesDir = path.join(root, "cases");
  for (const f of fs.readdirSync(casesDir)) {
    if (f.endsWith(".yml")) t.cases[f.replace(/\.yml$/, "")] = load(path.join(casesDir, f));
  }
  return t;
}
