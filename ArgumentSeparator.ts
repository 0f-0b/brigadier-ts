import type { StringReader } from "./StringReader.ts";

export type ArgumentSeparator = (reader: StringReader) => boolean;
export const defaultArgumentSeparator: ArgumentSeparator = (reader) => {
  if (reader.peek() === " ") {
    reader.skip();
    return true;
  }
  return false;
};
