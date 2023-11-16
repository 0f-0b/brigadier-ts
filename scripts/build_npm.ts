#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env=DENO_AUTH_TOKENS,DENO_DIR,HOME --allow-run=npm

import { build, emptyDir } from "../deps/dnt.ts";

const [version] = Deno.args;
if (version === undefined) {
  console.warn(
    "%cWarning%c Version is not provided; package will be unpublishable.",
    "color: yellow",
    "",
  );
}
Deno.chdir(new URL("..", import.meta.url));
await emptyDir("npm");
await build({
  entryPoints: ["mod.ts"],
  outDir: "npm",
  shims: {
    deno: { test: "dev" },
    customDev: [
      {
        package: {
          name: "core-js-pure",
          version: "3.33.0",
          subPath: "actual/iterator/index.js",
        },
        globalNames: [
          { name: "Iterator", exportName: "default" },
        ],
      },
    ],
  },
  mappings: {
    "https://esm.sh/v134/@esfx/equatable@1.0.2?bundle&target=esnext": {
      name: "@esfx/equatable",
      version: "^1.0.2",
    },
    "https://esm.sh/v134/@esfx/ref@1.0.0?target=esnext": {
      name: "@esfx/ref",
      version: "^1.0.0",
    },
  },
  package: {
    private: version === undefined,
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
  filterDiagnostic(diagnostic) {
    switch (diagnostic.code) {
      case 2699:
      case 7016:
      case 18046:
        return false;
      default:
        return true;
    }
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
