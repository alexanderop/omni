import { Command, Options } from '@effect/cli';
import { Effect } from 'effect';

const backendOption = Options.choice('backend', ['claude', 'codex', 'copilot']).pipe(
	Options.withAlias('b'),
	Options.withDescription(
		'Which backend to dispatch to (default: configured backend, else claude)',
	),
	Options.optional,
);

const modelOption = Options.text('model').pipe(
	Options.withAlias('m'),
	Options.withDescription('Model name to forward to the active backend'),
	Options.optional,
);

/**
 * Root command, exposed so subcommand handlers can read shared options via
 * `yield* root` (the @effect/cli pattern for parent-config access).
 */
export const root = Command.make('omni', {
	backend: backendOption,
	model: modelOption,
}).pipe(
	Command.withDescription('Unified wrapper around Claude Code, Codex, and GitHub Copilot CLIs.'),
	Command.withHandler(() => Effect.logInfo('Run `omni --help` for available commands.')),
);
