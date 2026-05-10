import { describe, expect, it } from 'vitest';
import { BACKENDS, isBackend } from '../src/domain/ids.js';

describe('backend ids', () => {
	it('recognizes the three supported backends', () => {
		expect(BACKENDS).toEqual(['claude', 'codex', 'copilot']);
		expect(isBackend('claude')).toBe(true);
		expect(isBackend('codex')).toBe(true);
		expect(isBackend('copilot')).toBe(true);
	});

	it('rejects unknown backends', () => {
		expect(isBackend('gemini')).toBe(false);
		expect(isBackend('')).toBe(false);
	});
});
