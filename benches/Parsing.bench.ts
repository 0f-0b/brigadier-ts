import { literal } from "../builder/LiteralArgumentBuilder.ts";
import { CommandDispatcher } from "../CommandDispatcher.ts";

const subject = new CommandDispatcher();
subject.register(
  literal("a")
    .then(
      literal("1")
        .then(literal("i").executes(() => 0))
        .then(literal("ii").executes(() => 0)),
    )
    .then(
      literal("2")
        .then(literal("i").executes(() => 0))
        .then(literal("ii").executes(() => 0)),
    ),
);
subject.register(literal("b").then(literal("1").executes(() => 0)));
subject.register(literal("c").executes(() => 0));
subject.register(literal("d").requires(() => false).executes(() => 0));
subject.register(
  literal("e")
    .executes(() => 0)
    .then(
      literal("1")
        .executes(() => 0)
        .then(literal("i").executes(() => 0))
        .then(literal("ii").executes(() => 0)),
    ),
);
subject.register(
  literal("f")
    .then(
      literal("1")
        .then(literal("i").executes(() => 0))
        .then(literal("ii").executes(() => 0).requires(() => false)),
    )
    .then(
      literal("2")
        .then(literal("i").executes(() => 0).requires(() => false))
        .then(literal("ii").executes(() => 0)),
    ),
);
subject.register(
  literal("g")
    .executes(() => 0)
    .then(literal("1").then(literal("i").executes(() => 0))),
);
const h = subject.register(
  literal("h")
    .executes(() => 0)
    .then(literal("1").then(literal("i").executes(() => 0)))
    .then(literal("2").then(literal("i").then(literal("ii").executes(() => 0))))
    .then(literal("3").executes(() => 0)),
);
subject.register(
  literal("i")
    .executes(() => 0)
    .then(literal("1").executes(() => 0))
    .then(literal("2").executes(() => 0)),
);
subject.register(
  literal("j")
    .redirect(subject.getRoot()),
);
subject.register(
  literal("k")
    .redirect(h),
);
subject.register(
  literal("l")
    .then(
      literal("1")
        .then(
          literal("2")
            .then(
              literal("3")
                .then(
                  literal("4")
                    .then(
                      literal("5")
                        .then(
                          literal("6")
                            .then(
                              literal("7")
                                .then(
                                  literal("8")
                                    .then(
                                      literal("9")
                                        .executes(() => 0),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);

Deno.bench("parse a1i", () => {
  subject.parse("a 1 i", {});
});

Deno.bench("parse c", () => {
  subject.parse("c", {});
});

Deno.bench("parse k1i", () => {
  subject.parse("k 1 i", {});
});

Deno.bench("parse l123456789", () => {
  subject.parse("l 1 2 3 4 5 6 7 8 9", {});
});
