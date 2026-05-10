import { Args, Command } from "@effect/cli"
import { Console, Effect } from "effect"

const actionArg = Args.choice<"list" | "set">([
  ["list", "list"],
  ["set", "set"]
]).pipe(Args.withDefault<"list" | "set">("list"))

export const modelCommand = Command.make("model", { action: actionArg }, ({ action }) =>
  Effect.gen(function*() {
    if (action === "list") {
      yield* Console.log("Models depend on the active backend. Use `--model <name>` on any command to override.")
    } else {
      yield* Console.log("model set: not yet implemented; pass `--model <name>` per command for now.")
    }
  })).pipe(Command.withDescription("Show or set the model used by the active backend."))
