import type { Awaitable } from "./async.ts";
import type { CommandContext } from "./context/CommandContext.ts";

export type RedirectModifier<S> = (
  context: CommandContext<S>,
) => Awaitable<Iterable<S> | AsyncIterable<S>>;
