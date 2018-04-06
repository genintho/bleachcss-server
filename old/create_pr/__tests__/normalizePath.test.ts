import normalizePath from '../normalizePath';

test('no new selector', () => {
    expect(normalizePath('/tmp/job_create_prc2A8to/genintho-test-b6b72f9/css/test.css', '/tmp/job_create_prc2A8to')).toBe('css/test.css');
});
