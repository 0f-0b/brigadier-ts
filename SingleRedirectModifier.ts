import type { Awaitable } from "./async.ts";
import type { CommandContext } from "./context/CommandContext.ts";

export type SingleRedirectModifier<S> = (
  context: CommandContext<S>,
) => Awaitable<S>;
