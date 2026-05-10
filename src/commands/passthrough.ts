import { Args, Command } from "@effect/cli"
import { Effect } from "effect"
import { Backends } from "../services/Backends.js"

const restArg = Args.text({ name: "args" }).pipe(Args.repeated)

const make = (name: "claude" | "codex" | "copilot") =>
  Command.make(name, { args: restArg }, ({ args }) =>
    Effect.gen(function*() {
      const backends = yield* Backends
      const backend = yield* backends.get(name)
      yield* backend.passthrough(args)
    })).pipe(Command.withDescription(`Forward all arguments verbatim to ${name}.`))

export const passthroughCommands = [make("claude"), make("codex"), make("copilot")]
