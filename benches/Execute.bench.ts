import { CommandDispatcher } from "../CommandDispatcher.ts";
import { literal } from "../builder/LiteralArgumentBuilder.ts";

const dispatcher = new CommandDispatcher();
dispatcher.register(literal("command").executes(() => 0));
dispatcher.register(literal("redirect").redirect(dispatcher.getRoot()));
dispatcher.register(
  literal("fork").fork(dispatcher.getRoot(), () => [{}, {}, {}]),
);
const simple = dispatcher.parse("command", {});
const singleRedirect = dispatcher.parse("redirect command", {});
const forkedRedirect = dispatcher.parse("fork command", {});

Deno.bench("execute simple", () => {
  dispatcher.execute(simple);
});

Deno.bench("execute single redirect", () => {
  dispatcher.execute(singleRedirect);
});

Deno.bench("execute forked redirect", () => {
  dispatcher.execute(forkedRedirect);
});
