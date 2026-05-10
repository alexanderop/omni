#!/usr/bin/env node
import { spawnSync } from "node:child_process"

const BACKENDS = new Set(["claude", "codex", "copilot"])

const subcommand = process.argv[2]

if (subcommand !== undefined && BACKENDS.has(subcommand)) {
  const result = spawnSync(subcommand, process.argv.slice(3), { stdio: "inherit" })
  if (result.error !== undefined) {
    console.error(`omni: failed to spawn ${subcommand}: ${result.error.message}`)
    process.exit(127)
  }
  process.exit(result.status ?? 1)
} else {
  await import("./main.js")
}
