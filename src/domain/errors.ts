import { Data } from "effect"

export class BackendNotFound extends Data.TaggedError("BackendNotFound")<{
  readonly name: string
}> {}

export class BackendNotInstalled extends Data.TaggedError("BackendNotInstalled")<{
  readonly name: string
  readonly hint: string
}> {}

export class SpawnFailed extends Data.TaggedError("SpawnFailed")<{
  readonly cmd: string
  readonly args: ReadonlyArray<string>
  readonly cause: unknown
}> {}

export class NonZeroExit extends Data.TaggedError("NonZeroExit")<{
  readonly cmd: string
  readonly exitCode: number
}> {}

export class ConfigInvalid extends Data.TaggedError("ConfigInvalid")<{
  readonly path: string
  readonly reason: string
}> {}

export type OmniError = BackendNotFound | BackendNotInstalled | SpawnFailed | NonZeroExit | ConfigInvalid
