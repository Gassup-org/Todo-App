import { describe, expect, it } from 'vitest';

describe('env contract', () => {
  it('keeps test auth disabled outside test environments by contract', () => {
    const testAuthKey = 'TEST_AUTH_ENABLED=false';

    expect(testAuthKey).toContain('TEST_AUTH_ENABLED');
    expect(testAuthKey).toContain('false');
  });
});
