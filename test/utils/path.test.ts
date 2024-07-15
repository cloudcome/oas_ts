import { toRelative } from '../../src/utils/path';

test('toRelative', () => {
    expect(toRelative('./a/b/c')).toBe('./a/b/c');
    expect(toRelative('/a/b/c')).toBe('/a/b/c');
    expect(toRelative('./a/b/c', '/a')).toBe('./a/b/c');
    expect(toRelative('/a/b/c', '/a')).toBe('./b/c');
    expect(toRelative('/a/b/c', '/a/b')).toBe('./c');
    expect(toRelative('/a/b/c', '/a/b/e')).toBe('../c');
    expect(toRelative('/a/b/c', '/a/d/e')).toBe('../../b/c');
});
