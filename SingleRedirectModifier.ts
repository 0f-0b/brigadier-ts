import type { CommandContext } from "./context/CommandContext.ts";

export type SingleRedirectModifier<S> = (context: CommandContext<S>) => S;
