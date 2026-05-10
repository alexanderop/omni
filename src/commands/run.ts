import { Args, Command } from "@effect/cli"
import { Effect, Option } from "effect"
import { root } from "./_root.js"
import { resolveBackend } from "./_shared.js"

const promptArg = Args.text({ name: "prompt" }).pipe(Args.withDescription("Prompt to dispatch"))

export const runCommand = Command.make("run", { prompt: promptArg }, ({ prompt }) =>
  Effect.gen(function*() {
    const { backend: selected, model } = yield* root
    const backend = yield* resolveBackend(Option.getOrUndefined(selected))
    yield* backend.run(prompt, { model: Option.getOrUndefined(model) })
  })).pipe(Command.withDescription("Run a one-shot prompt against the active backend."))
