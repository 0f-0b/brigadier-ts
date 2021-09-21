import type { CommandContext } from "./context/CommandContext.ts";

export type RedirectModifier<S> = (context: CommandContext<S>) => Iterable<S>;
