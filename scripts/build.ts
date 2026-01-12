import { build } from "bun";
import { chmod, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outfile = join(import.meta.dir, "../dist/index.js");

const result = await build({
  entrypoints: ["./src/index.ts"],
  target: "node",
  external: ["@modelcontextprotocol/sdk", "puppeteer-core", "zod"],
  outdir: "./dist",
  // Bun build currently doesn't support a specific 'outfile' name with multiple entrypoints or specific setups easily in the API
  // but for a single entrypoint we can just rename it after.
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

// Read the generated file
const content = await readFile(outfile, "utf-8");

// Add shebang
const withShebang = `#!/usr/bin/env node\n${content}`;

await writeFile(outfile, withShebang);
await chmod(outfile, 0o755);

console.log("Build complete with shebang!");
