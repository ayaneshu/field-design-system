/**
 * Pulls every M-Icon node from the Field Design System Figma file and writes
 * one SVG per icon to ../src/svg/.
 *
 * Naming:
 *   "M-Icon/System-Icon/arrow-up"           → system-arrow-up.svg
 *   "M-Icon/Bottomnav-Icon/home/default"    → bottomnav-home-default.svg
 *
 * Requirements:
 *   FIGMA_TOKEN — a personal access token with read scope on the file.
 *
 * Usage (from repo root):
 *   FIGMA_TOKEN=figd_xxx pnpm fetch:icons
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const FILE_KEY = "wFRKiKskxZ4vjIHbDVvngJ";
const ROOT_NODE = "1:169";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../src/svg");

const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) {
  console.error("ERROR: set FIGMA_TOKEN in env. See https://www.figma.com/developers/api#access-tokens");
  process.exit(1);
}

type FNode = {
  id: string;
  name: string;
  type: string;
  children?: FNode[];
};

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { "X-Figma-Token": TOKEN! },
  });
  if (!res.ok) throw new Error(`Figma API ${res.status} on ${path}: ${await res.text()}`);
  return (await res.json()) as T;
}

function slugify(name: string): string {
  let n = name.trim();
  if (n.startsWith("M-Icon/")) n = n.slice("M-Icon/".length);
  n = n.replace(/M-Icon\//g, "");
  n = n.replace(/^System-Icon\//i, "system/");
  n = n.replace(/^Bottomnav-Icon\//i, "bottomnav/");
  n = n.replace(/[/\s]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return n.toLowerCase();
}

type Target = { id: string; slug: string };

function collectTargets(node: FNode, targets: Target[] = []): Target[] {
  if (typeof node.name === "string" && node.name.startsWith("M-Icon/")) {
    if (/\/\s*$/.test(node.name)) return targets; // empty trailing slash
    const stateKids = (node.children ?? []).filter((c) => /^State=/.test(c.name));
    if (stateKids.length > 0) {
      for (const k of stateKids) {
        const state = k.name.replace(/^State=/, "");
        targets.push({ id: k.id, slug: slugify(`${node.name}/${state}`) });
      }
    } else {
      targets.push({ id: node.id, slug: slugify(node.name) });
    }
    return targets; // don't descend further into icon nodes
  }
  for (const child of node.children ?? []) collectTargets(child, targets);
  return targets;
}

function chunk<T>(xs: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n));
  return out;
}

async function main() {
  console.log(`Fetching node tree (${FILE_KEY} @ ${ROOT_NODE})…`);
  const tree = await api<{ nodes: Record<string, { document: FNode }> }>(
    `/files/${FILE_KEY}/nodes?ids=${ROOT_NODE}`,
  );
  const root = Object.values(tree.nodes)[0]?.document;
  if (!root) throw new Error("Root node not returned by Figma API");

  const targets = collectTargets(root);
  // dedupe by slug, keep first
  const seen = new Set<string>();
  const unique = targets.filter((t) => (seen.has(t.slug) ? false : (seen.add(t.slug), true)));
  console.log(`Found ${unique.length} icons.`);

  mkdirSync(OUT_DIR, { recursive: true });

  // Figma /v1/images caps URLs; chunk requests.
  const groups = chunk(unique, 50);
  let fetched = 0;
  for (const group of groups) {
    const ids = group.map((g) => g.id).join(",");
    const urls = await api<{ images: Record<string, string> }>(
      `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg`,
    );
    await Promise.all(
      group.map(async (g) => {
        const url = urls.images[g.id];
        if (!url) {
          console.warn(`  skip ${g.slug} — no image URL returned`);
          return;
        }
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`  skip ${g.slug} — download ${res.status}`);
          return;
        }
        const svg = await res.text();
        writeFileSync(resolve(OUT_DIR, `${g.slug}.svg`), svg);
        fetched++;
      }),
    );
    console.log(`  ${fetched}/${unique.length}`);
  }
  console.log(`✔ Wrote ${fetched} SVGs to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
