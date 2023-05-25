import type { Awaitable } from "./async.ts";
import type { CommandContext } from "./context/CommandContext.ts";

export type Command<S> = (context: CommandContext<S>) => Awaitable<number>;
