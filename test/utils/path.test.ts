import { isRelative, toImportPath, toRelative } from '../../src/utils/path';

it('isRelative', () => {
  expect(isRelative('./a/b/c')).toBe(true);
  expect(isRelative('/a/b/c')).toBe(false);
  expect(isRelative('a/b/c')).toBe(false);
});

it('toRelative', () => {
  expect(toRelative('./a/b/c')).toBe('./a/b/c');
  expect(toRelative('/a/b/c')).toBe('/a/b/c');
  expect(toRelative('./a/b/c', '/a')).toBe('./a/b/c');
  expect(toRelative('/a/b/c', '/a')).toBe('./a/b/c');
  expect(toRelative('/a/b/c', '/a/b')).toBe('./b/c');
  expect(toRelative('/a/b/c', '/a/b/e')).toBe('./c');
  expect(toRelative('/a/b/c', '/a/d/e')).toBe('../b/c');
});

it('toImportPath', () => {
  expect(toImportPath('./a/b/c', '/cwd')).toBe('/cwd/a/b/c');
  expect(toImportPath('a/b/c', '/cwd')).toBe('a/b/c');
  expect(toImportPath('/a/b/c', '/cwd')).toBe('/a/b/c');
  expect(toImportPath('./a/b/c', '/cwd', '/cwd/d/e/f')).toBe('../../a/b/c');
  expect(toImportPath('a/b/c', '/cwd', '/cwd/d/e/f')).toBe('a/b/c');
  expect(toImportPath('/a/b/c', '/cwd', '/cwd/d/e/f')).toBe('../../../a/b/c');
});
