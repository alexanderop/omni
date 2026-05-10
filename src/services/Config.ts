import { Effect } from "effect"
import type { Backend } from "../domain/ids.js"

/**
 * Runtime configuration for omni. v1 reads only the default backend from an
 * env var (`OMNI_BACKEND`) and falls back to "claude". A TOML loader for
 * `~/.config/omni/config.toml` will land later.
 */
export class OmniConfig extends Effect.Service<OmniConfig>()("omni/Config", {
  effect: Effect.sync(() => {
    const envBackend = process.env["OMNI_BACKEND"]
    const defaultBackend: Backend = envBackend === "codex" || envBackend === "copilot" || envBackend === "claude"
      ? envBackend
      : "claude"
    return {
      defaultBackend
    }
  })
}) {}
