import { Effect } from 'effect';
import { BackendNotFound } from '../domain/errors.js';
import type { Backend as BackendId } from '../domain/ids.js';
import type { BackendImpl } from './Backend.js';
import { ClaudeBackend } from './ClaudeBackend.js';
import { CodexBackend } from './CodexBackend.js';
import { CopilotBackend } from './CopilotBackend.js';

/**
 * Aggregates the three concrete backends behind a single Effect.Service so
 * command handlers can ask for `Backends` and resolve the active one based on
 * a CLI flag or config default.
 */
export class Backends extends Effect.Service<Backends>()('omni/Backends', {
	succeed: {
		claude: ClaudeBackend,
		codex: CodexBackend,
		copilot: CopilotBackend,
		get: (id: BackendId): Effect.Effect<BackendImpl, BackendNotFound> => {
			switch (id) {
				case 'claude':
					return Effect.succeed(ClaudeBackend);
				case 'codex':
					return Effect.succeed(CodexBackend);
				case 'copilot':
					return Effect.succeed(CopilotBackend);
				default:
					return Effect.fail(new BackendNotFound({ name: id }));
			}
		},
	},
}) {}
