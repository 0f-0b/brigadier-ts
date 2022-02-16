import { bench, runBenchmarks } from "../bench_deps.ts";
import { literal } from "../builder/LiteralArgumentBuilder.ts";
import { CommandDispatcher } from "../CommandDispatcher.ts";

const dispatcher = new CommandDispatcher();
dispatcher.register(literal("command").executes(() => 0));
dispatcher.register(literal("redirect").redirect(dispatcher.getRoot()));
dispatcher.register(
  literal("fork").fork(dispatcher.getRoot(), () => [{}, {}, {}]),
);
const simple = dispatcher.parse("command", {});
const singleRedirect = dispatcher.parse("redirect command", {});
const forkedRedirect = dispatcher.parse("fork command", {});

bench({
  name: "execute simple",
  func(timer) {
    timer.start();
    dispatcher.execute(simple);
    timer.stop();
  },
  runs: 500000,
});

bench({
  name: "execute single redirect",
  func(timer) {
    timer.start();
    dispatcher.execute(singleRedirect);
    timer.stop();
  },
  runs: 500000,
});

bench({
  name: "execute forked redirect",
  func(timer) {
    timer.start();
    dispatcher.execute(forkedRedirect);
    timer.stop();
  },
  runs: 500000,
});

await runBenchmarks();
