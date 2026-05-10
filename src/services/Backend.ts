import type { CommandExecutor } from '@effect/platform/CommandExecutor';
import type { Effect } from 'effect';
import type { OmniError } from '../domain/errors.js';
import type { Backend } from '../domain/ids.js';

export interface RunOptions {
	readonly model?: string | undefined;
	readonly cwd?: string | undefined;
	readonly extraArgs?: ReadonlyArray<string> | undefined;
}

export interface ChatOptions {
	readonly model?: string | undefined;
	readonly cwd?: string | undefined;
}

export interface ResumeOptions {
	readonly sessionId?: string | undefined;
	readonly last?: boolean | undefined;
}

export interface AuthAction {
	readonly action: 'login' | 'logout' | 'status';
}

export interface McpAction {
	readonly action: 'list' | 'add' | 'remove';
	readonly name?: string | undefined;
	readonly url?: string | undefined;
}

/**
 * The normalized capability surface every backend must implement.
 *
 * Concrete backends translate these calls into their native CLI flags
 * (e.g. `claude -p`, `codex exec`, `copilot -p`) and spawn the subprocess
 * via `lib/spawn.ts`. The `CommandExecutor` requirement is satisfied by
 * `NodeContext.layer` at the program edge.
 */
export interface BackendImpl {
	readonly name: Backend;
	readonly bin: string;
	readonly run: (
		prompt: string,
		opts: RunOptions,
	) => Effect.Effect<number, OmniError, CommandExecutor>;
	readonly chat: (opts: ChatOptions) => Effect.Effect<number, OmniError, CommandExecutor>;
	readonly resume: (opts: ResumeOptions) => Effect.Effect<number, OmniError, CommandExecutor>;
	readonly mcp: (action: McpAction) => Effect.Effect<number, OmniError, CommandExecutor>;
	readonly auth: (action: AuthAction) => Effect.Effect<number, OmniError, CommandExecutor>;
	readonly passthrough: (
		argv: ReadonlyArray<string>,
	) => Effect.Effect<number, OmniError, CommandExecutor>;
}
