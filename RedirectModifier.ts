import type { CommandContext } from "./context/CommandContext.ts";
import type { Awaitable } from "./util.ts";

export type RedirectModifier<S> = (
  context: CommandContext<S>,
) => Awaitable<Iterable<S> | AsyncIterable<S>>;
