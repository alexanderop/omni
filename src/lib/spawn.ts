import { Command } from '@effect/platform';
import { Effect } from 'effect';
import { NonZeroExit, SpawnFailed } from '../domain/errors.js';

/**
 * Spawn a subprocess and inherit stdio from the parent process. Suitable for
 * wrapping interactive CLIs and long-running one-shot prompts where output
 * should stream straight through to the user.
 */
export const inheritStdio = (cmd: string, args: ReadonlyArray<string>) =>
	Command.make(cmd, ...args).pipe(
		Command.stdin('inherit'),
		Command.stdout('inherit'),
		Command.stderr('inherit'),
		Command.exitCode,
		Effect.mapError((cause) => new SpawnFailed({ cmd, args, cause })),
		Effect.flatMap((code) =>
			code === 0 ? Effect.succeed(0) : Effect.fail(new NonZeroExit({ cmd, exitCode: code })),
		),
	);
