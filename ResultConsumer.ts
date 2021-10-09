import type { CommandContext } from "./context/CommandContext.ts";

export type ResultConsumer<S> = (
  context: CommandContext<S>,
  success: boolean,
  result: number,
) => void;
