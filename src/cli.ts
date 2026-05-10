import { Command } from "@effect/cli"
import { root } from "./commands/_root.js"
import { authCommand } from "./commands/auth.js"
import { chatCommand } from "./commands/chat.js"
import { mcpCommand } from "./commands/mcp.js"
import { modelCommand } from "./commands/model.js"
import { passthroughCommands } from "./commands/passthrough.js"
import { resumeCommand } from "./commands/resume.js"
import { runCommand } from "./commands/run.js"

const cliCommand = root.pipe(
  Command.withSubcommands([
    runCommand,
    chatCommand,
    resumeCommand,
    modelCommand,
    mcpCommand,
    authCommand,
    ...passthroughCommands
  ])
)

export const cli = Command.run(cliCommand, {
  name: "omni",
  version: "0.0.0"
})
