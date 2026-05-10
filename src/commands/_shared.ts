import { Effect } from "effect"
import type { Backend } from "../domain/ids.js"
import { Backends } from "../services/Backends.js"
import { OmniConfig } from "../services/Config.js"

/**
 * Resolve the active backend by precedence: explicit `--backend` flag, then
 * `OMNI_BACKEND` env / configured default.
 */
export const resolveBackend = (selected: Backend | undefined) =>
  Effect.gen(function*() {
    const config = yield* OmniConfig
    const backends = yield* Backends
    const id = selected ?? config.defaultBackend
    return yield* backends.get(id)
  })
