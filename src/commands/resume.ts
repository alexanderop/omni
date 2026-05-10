import { Args, Command, Options } from "@effect/cli"
import { Effect, Option } from "effect"
import { root } from "./_root.js"
import { resolveBackend } from "./_shared.js"

const idArg = Args.text({ name: "session-id" }).pipe(Args.optional)

const lastOption = Options.boolean("last").pipe(
  Options.withDescription("Resume the most recent session"),
  Options.withDefault(false)
)

export const resumeCommand = Command.make(
  "resume",
  { id: idArg, last: lastOption },
  ({ id, last }) =>
    Effect.gen(function*() {
      const { backend: selected } = yield* root
      const backend = yield* resolveBackend(Option.getOrUndefined(selected))
      yield* backend.resume({ sessionId: Option.getOrUndefined(id), last })
    })
).pipe(Command.withDescription("Resume a previous session (latest with --last, or by id)."))
