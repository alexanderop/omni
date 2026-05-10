import { Args, Command } from '@effect/cli';
import { Effect, Option } from 'effect';
import { root } from './_root.js';
import { resolveBackend } from './_shared.js';

const actionArg = Args.choice<'login' | 'logout' | 'status'>([
	['login', 'login'],
	['logout', 'logout'],
	['status', 'status'],
]).pipe(Args.withDefault<'login' | 'logout' | 'status'>('status'));

export const authCommand = Command.make('auth', { action: actionArg }, ({ action }) =>
	Effect.gen(function* () {
		const { backend: selected } = yield* root;
		const backend = yield* resolveBackend(Option.getOrUndefined(selected));
		yield* backend.auth({ action });
	}),
).pipe(Command.withDescription('Manage authentication for the active backend.'));
