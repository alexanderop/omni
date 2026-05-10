import { Command } from '@effect/cli';
import { Effect, Option } from 'effect';
import { root } from './_root.js';
import { resolveBackend } from './_shared.js';

export const chatCommand = Command.make('chat', {}, () =>
	Effect.gen(function* () {
		const { backend: selected, model } = yield* root;
		const backend = yield* resolveBackend(Option.getOrUndefined(selected));
		yield* backend.chat({ model: Option.getOrUndefined(model) });
	}),
).pipe(Command.withDescription('Start an interactive REPL session with the active backend.'));
