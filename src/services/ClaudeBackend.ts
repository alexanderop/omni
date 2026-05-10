import { Effect } from "effect"
import { inheritStdio } from "../lib/spawn.js"
import type { BackendImpl } from "./Backend.js"

const BIN = "claude"

export const ClaudeBackend: BackendImpl = {
  name: "claude",
  bin: BIN,
  run: (prompt, opts) => {
    const args: Array<string> = ["-p", prompt]
    if (opts.model !== undefined) args.push("--model", opts.model)
    if (opts.cwd !== undefined) args.push("--add-dir", opts.cwd)
    if (opts.extraArgs) args.push(...opts.extraArgs)
    return inheritStdio(BIN, args)
  },
  chat: (opts) => {
    const args: Array<string> = []
    if (opts.model !== undefined) args.push("--model", opts.model)
    if (opts.cwd !== undefined) args.push("--add-dir", opts.cwd)
    return inheritStdio(BIN, args)
  },
  resume: (opts) => {
    if (opts.last) return inheritStdio(BIN, ["-c"])
    if (opts.sessionId !== undefined) return inheritStdio(BIN, ["-r", opts.sessionId])
    return inheritStdio(BIN, ["-r"])
  },
  mcp: (action) => {
    const args: Array<string> = ["mcp"]
    if (action.action === "list") args.push("list")
    else if (action.action === "add" && action.name !== undefined && action.url !== undefined) {
      args.push("add", action.name, action.url)
    } else if (action.action === "remove" && action.name !== undefined) {
      args.push("remove", action.name)
    } else {
      return Effect.succeed(1)
    }
    return inheritStdio(BIN, args)
  },
  auth: (action) => {
    if (action.action === "login") return inheritStdio(BIN, ["setup-token"])
    if (action.action === "logout") return inheritStdio(BIN, ["auth", "logout"])
    return inheritStdio(BIN, ["auth", "status"])
  },
  passthrough: (argv) => inheritStdio(BIN, [...argv])
}
