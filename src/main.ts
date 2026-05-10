import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { Effect, Layer } from 'effect';
import { cli } from './cli.js';
import { Backends } from './services/Backends.js';
import { OmniConfig } from './services/Config.js';

const MainLayer = Layer.mergeAll(OmniConfig.Default, Backends.Default, NodeContext.layer);

Effect.suspend(() => cli(process.argv)).pipe(
	Effect.provide(MainLayer),
	NodeRuntime.runMain({ disableErrorReporting: true }),
);
