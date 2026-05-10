# Agent guide

This repo is built on [Effect](https://effect.website) using `@effect/cli` for
argument parsing and `@effect/platform/Command` for subprocess management.

## What this is

`omni` wraps three coding-agent CLIs (`claude`, `codex`, `copilot`) behind a
unified surface. Every backend implements the same `Backend` interface
(`src/services/Backend.ts`) and exposes the six normalized commands plus a
passthrough escape hatch.

## Conventions

- **Effect services use `Effect.Service`** — see `src/services/*Backend.ts`.
- **Errors are `Data.TaggedError`** with `_tag` discriminants — see
  `src/domain/errors.ts`.
- **Branded literal types** (`Backend`, `SessionId`) live in `src/domain/ids.ts`
  and are constructed at the orchestrator boundary, never inside services.
- **Subprocess spawning goes through `src/lib/spawn.ts`** which wraps
  `@effect/platform/Command`. Don't import `node:child_process` directly,
  except in `src/bin.ts` where the passthrough fast-path needs to bypass
  Effect entirely so `--version` and `--help` reach the wrapped CLI.
- **Tests use Bun's built-in runner** (`bun:test`) — imports come from
  `bun:test`, run with `bun test`.
- **Lint/format**: `oxlint --type-aware` + `oxfmt`. Project-specific rules
  live in `tooling/oxlint-plugin.js` (namespace `omni/`); base rule set is
  configured in `.oxlintrc.json`. Run `bun run check` before committing —
  it runs build, typecheck, lint, format-check, and tests in one go.

## Toolchain

This repo uses [Bun](https://bun.sh) as the package manager and runtime for
dev/test. The published binary still targets Node — `bun run build` invokes
`tsc` to emit `dist/bin.js`, which keeps the `#!/usr/bin/env node` shebang so
consumers don't need Bun installed. Use:

- `bun install` to install dependencies
- `bun run dev <args>` for a no-build dev loop (Bun runs TS directly)
- `bun test` / `bun test --watch` for the test suite
- `bun run check` for the full CI-equivalent gate

## When you need to look up Effect

Effect is huge. Reach for its docs at https://effect.website first. For
`@effect/cli` specifically, the README and the `naval-fate` example in the
upstream repo (https://github.com/Effect-TS/effect/tree/main/packages/cli) are
the canonical references — the API surface used here is `Command.make`,
`Command.withSubcommands`, `Args.*`, `Options.*`, and `Command.run`.

For subprocess work, see `@effect/platform/Command` —
`Command.make(cmd, ...args)` plus `Command.stdout("inherit")` /
`Command.exitCode` covers ~all of what `omni` needs.

## Adding a new backend

1. Add a new `*.ts` in `src/services/` that extends `Effect.Service<Self>()`
   and implements the `Backend` interface from `src/services/Backend.ts`.
2. Register it in `src/services/index.ts` and add it to `MainLayer` in
   `src/main.ts`.
3. Add a passthrough subcommand in `src/commands/passthrough.ts`.
4. Update `~/.config/omni/config.toml` schema in `src/services/Config.ts`.

## Adding a new normalized command

1. Add a file in `src/commands/`. Follow the pattern of `src/commands/run.ts`:
   `Command.make(name, { ...args, ...opts }, handler)`.
2. Wire it into `src/cli.ts` via `Command.withSubcommands`.
3. Implement the handler against the `Backend` service so it works for all
   backends uniformly.
4. Add a parsing test in `test/cli.test.ts`.

## Workflow

1. **Fresh agent context per task.** Avoid long sessions that accrete failed
   attempts and biased priors.
2. **Don't bypass diagnostics.** TypeScript errors, oxlint errors, and failing
   tests are the playpen. If a rule blocks you, fix the code or argue for
   removing the rule — don't disable it inline.
