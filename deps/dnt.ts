export * from "https://deno.land/x/dnt@0.33.0/mod.ts";

declare global {
  namespace Deno {
    /** @deprecated */
    export type File = FsFile;
  }
}
