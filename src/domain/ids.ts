export const BACKENDS = ["claude", "codex", "copilot"] as const
export type Backend = (typeof BACKENDS)[number]

export const isBackend = (s: string): s is Backend => (BACKENDS as readonly string[]).includes(s)

export type SessionId = string & { readonly _: unique symbol }
export const SessionId = (s: string): SessionId => s as SessionId
