import type { CommandContext } from "./context/CommandContext.ts";
import type { Awaitable } from "./util.ts";

export type Command<S> = (context: CommandContext<S>) => Awaitable<number>;
