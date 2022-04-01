import type { CommandContext } from "./context/CommandContext.ts";
import type { Awaitable } from "./util.ts";

export type SingleRedirectModifier<S> = (
  context: CommandContext<S>,
) => Awaitable<S>;
