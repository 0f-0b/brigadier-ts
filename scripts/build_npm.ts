#!/usr/bin/env -S deno run -A

import { build, emptyDir } from "../deps/dnt.ts";

const [version] = Deno.args;
if (!version) {
  console.error("usage: ./scripts/build_npm.ts <version>");
  Deno.exit(2);
}
Deno.chdir(new URL("..", import.meta.url));
await emptyDir("npm");
await build({
  entryPoints: ["mod.ts"],
  outDir: "npm",
  shims: {
    deno: { test: "dev" },
  },
  mappings: {
    "https://esm.sh/@esfx/equatable@1.0.2?bundle&target=esnext&pin=v99": {
      name: "@esfx/equatable",
      version: "^1.0.2",
    },
    "https://esm.sh/@esfx/ref@1.0.0?target=esnext&pin=v99": {
      name: "@esfx/ref",
      version: "^1.0.0",
    },
  },
  package: {
    name: "@ud2/brigadier",
    version,
    description: "TypeScript port of Brigadier.",
    keywords: ["command", "minecraft"],
    homepage: "https://github.com/0f-0b/brigadier-ts#readme",
    bugs: "https://github.com/0f-0b/brigadier-ts/issues",
    license: "MIT",
    author: "ud2",
    repository: "github:0f-0b/brigadier-ts",
    publishConfig: {
      access: "public",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
