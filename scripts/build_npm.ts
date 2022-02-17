#!/usr/bin/env -S deno run -A

import { build, emptyDir } from "https://deno.land/x/dnt@0.18.1/mod.ts";

Deno.chdir(new URL("..", import.meta.url));
const [version] = Deno.args;
if (!version) {
  Deno.exit(2);
}
await emptyDir("npm");
await build({
  entryPoints: ["mod.ts"],
  outDir: "npm",
  shims: {
    deno: { test: "dev" },
  },
  mappings: {
    "https://esm.sh/@esfx/equatable@1.0.0-pre.19?pin=v66": {
      name: "@esfx/equatable",
      version: "^1.0.0-pre.19",
    },
    "https://esm.sh/@esfx/ref@1.0.0-pre.23?pin=v66": {
      name: "@esfx/ref",
      version: "^1.0.0-pre.23",
    },
  },
  package: {
    name: "@ud2/brigadier",
    version,
    description: "TypeScript port of Brigadier.",
    keywords: ["command", "minecraft"],
    homepage: "https://github.com/sjx233/brigadier-ts#readme",
    bugs: "https://github.com/sjx233/brigadier-ts/issues",
    license: "MIT",
    author: "ud2",
    repository: "github:sjx233/brigadier-ts",
  },
});
await Promise.all([
  Deno.copyFile("LICENSE", "npm/LICENSE"),
  Deno.copyFile("LICENSE.brigadier", "npm/LICENSE.brigadier"),
  Deno.copyFile("README.md", "npm/README.md"),
]);
