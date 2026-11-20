// Entry program for the make.fun bounty "Sum up 19 November's world news
// in one image" (news-image-20261119).
//
// The artwork itself (entry.png) was drawn programmatically and is checked
// into this repo next to this file. This program's only job is to copy that
// image into the output directory the harness asks for, so the submitted
// artefact is exactly the image that was reviewed here.
//
// Usage:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// It uses only the Node.js standard library and makes no network requests.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The directory this script lives in is also where entry.png lives.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

// The harness sets MAKEFUN_OUTPUT_DIR; fall back to /output when unset
// (an empty string counts as unset, so a stray blank value cannot break it).
const outDir = process.env.MAKEFUN_OUTPUT_DIR?.trim() || "/output";
if (!existsSync(source)) {
  throw new Error(`entry.png not found next to main.ts (looked in ${here})`);
}
mkdirSync(outDir, { recursive: true });
const destination = join(outDir, "entry.png");
copyFileSync(source, destination);
// Sanity-check the copy: it must be a non-empty PNG of the expected size.
// A PNG always starts with the same 8 magic bytes; checking them catches
// a truncated or mistyped file instead of silently shipping it.
const copied = statSync(destination);
if (copied.size === 0) {
  throw new Error(`copied entry.png is empty (${destination})`);
}
const magic = readFileSync(destination).subarray(0, 8);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!magic.equals(pngMagic)) {
  throw new Error(`copied file is not a PNG (${destination})`);
}
console.log(`Wrote entry.png (${copied.size} bytes) to ${destination}`);
