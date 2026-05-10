import { Effect } from "effect"
import { inheritStdio } from "../lib/spawn.js"
import type { BackendImpl } from "./Backend.js"

const BIN = "copilot"

export const CopilotBackend: BackendImpl = {
  name: "copilot",
  bin: BIN,
  run: (prompt, opts) => {
    const args: Array<string> = ["-p", prompt, "--allow-all-tools"]
    if (opts.model !== undefined) args.push("--model", opts.model)
    if (opts.cwd !== undefined) args.push("-C", opts.cwd)
    if (opts.extraArgs) args.push(...opts.extraArgs)
    return inheritStdio(BIN, args)
  },
  chat: (opts) => {
    const args: Array<string> = []
    if (opts.model !== undefined) args.push("--model", opts.model)
    if (opts.cwd !== undefined) args.push("-C", opts.cwd)
    return inheritStdio(BIN, args)
  },
  resume: (opts) => {
    if (opts.last) return inheritStdio(BIN, ["--continue"])
    if (opts.sessionId !== undefined) return inheritStdio(BIN, [`--resume=${opts.sessionId}`])
    return inheritStdio(BIN, ["--resume"])
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
    if (action.action === "logout") return inheritStdio(BIN, ["login", "logout"])
    return inheritStdio(BIN, ["login", "status"])
  },
  passthrough: (argv) => inheritStdio(BIN, [...argv])
}
