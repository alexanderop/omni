export const BACKENDS = ['claude', 'codex', 'copilot'] as const;
export type Backend = (typeof BACKENDS)[number];

export const isBackend = (s: string): s is Backend => BACKENDS.some((b) => b === s);

export type SessionId = string;
