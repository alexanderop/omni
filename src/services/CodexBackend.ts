import { Effect } from "effect"
import { inheritStdio } from "../lib/spawn.js"
import type { BackendImpl } from "./Backend.js"

const BIN = "codex"

export const CodexBackend: BackendImpl = {
  name: "codex",
  bin: BIN,
  run: (prompt, opts) => {
    const args: Array<string> = ["exec"]
    if (opts.model !== undefined) args.push("-m", opts.model)
    if (opts.cwd !== undefined) args.push("-C", opts.cwd)
    if (opts.extraArgs) args.push(...opts.extraArgs)
    args.push(prompt)
    return inheritStdio(BIN, args)
  },
  chat: (opts) => {
    const args: Array<string> = []
    if (opts.model !== undefined) args.push("-m", opts.model)
    if (opts.cwd !== undefined) args.push("-C", opts.cwd)
    return inheritStdio(BIN, args)
  },
  resume: (opts) => {
    const args: Array<string> = ["resume"]
    if (opts.last) args.push("--last")
    else if (opts.sessionId !== undefined) args.push(opts.sessionId)
    return inheritStdio(BIN, args)
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
    if (action.action === "login") return inheritStdio(BIN, ["login"])
    if (action.action === "logout") return inheritStdio(BIN, ["logout"])
    return inheritStdio(BIN, ["login", "status"])
  },
  passthrough: (argv) => inheritStdio(BIN, [...argv])
}
