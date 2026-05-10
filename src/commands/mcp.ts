import { Args, Command } from "@effect/cli"
import { Effect, Option } from "effect"
import { root } from "./_root.js"
import { resolveBackend } from "./_shared.js"

const actionArg = Args.choice<"list" | "add" | "remove">([
  ["list", "list"],
  ["add", "add"],
  ["remove", "remove"]
])
const nameArg = Args.text({ name: "name" }).pipe(Args.optional)
const urlArg = Args.text({ name: "url" }).pipe(Args.optional)

export const mcpCommand = Command.make(
  "mcp",
  { action: actionArg, name: nameArg, url: urlArg },
  ({ action, name, url }) =>
    Effect.gen(function*() {
      const { backend: selected } = yield* root
      const backend = yield* resolveBackend(Option.getOrUndefined(selected))
      yield* backend.mcp({
        action,
        name: Option.getOrUndefined(name),
        url: Option.getOrUndefined(url)
      })
    })
).pipe(Command.withDescription("Manage MCP servers on the active backend."))
