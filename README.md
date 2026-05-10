# omni

> One CLI to drive Claude Code, Codex, and GitHub Copilot.

`omni` is a thin, Effect-native wrapper that exposes the **shared** capabilities
of three coding-agent CLIs (`claude`, `codex`, `copilot`) under a single
normalized interface, plus a passthrough escape hatch for each backend's
unique features.

## Status

Early scaffolding. v1 covers the six normalized commands plus passthrough.
Combine-mode (`omni run -b all`, `omni vote`, `omni race`) is planned for v2.

## Install

```sh
pnpm install
pnpm build
node dist/bin.js --help
```

The compiled binary is exposed as `omni` once the package is installed
(`pnpm link --global` for local use).

## Commands

```
omni run "<prompt>"       One-shot prompt against the active backend
omni chat                 Interactive REPL
omni resume [id|--last]   Resume / continue a session
omni model [list|set]     Show or set the model for the active backend
omni mcp [list|add|rm]    Manage MCP servers
omni auth [login|status]  Authenticate

omni claude  <args...>    Passthrough to claude
omni codex   <args...>    Passthrough to codex
omni copilot <args...>    Passthrough to copilot
```

Pick a backend with `-b/--backend claude|codex|copilot` (default configured in
`~/.config/omni/config.toml`).

## Backends

Each backend is an `Effect.Service` that translates omni's normalized calls
into the native CLI's flags and spawns the subprocess via
`@effect/platform/Command`. To add a new backend, implement the `Backend`
interface in `src/services/`.

## Development

```sh
pnpm dev "run \"hello\""   # tsx, no build step
pnpm test                  # vitest
pnpm check                 # typecheck + lint + format check
```

## Architecture

Built on [Effect](https://effect.website) and [`@effect/cli`](https://effect.website/docs/cli/getting-started).
See `AGENTS.md` for the conventions an LLM coding agent should follow when
extending this repo.

## License

MIT
