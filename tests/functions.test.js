import { describe, it, expect, vi } from 'vitest';
import { unique, groupBy, chunk, deepClone, memoize, counter } from '../src/functions.js';

describe('unique', () => {
  it('removes duplicates, keeps order of first occurrence', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('returns empty array for empty input', () => {
    expect(unique([])).toEqual([]);
  });
});

describe('groupBy', () => {
  it('groups objects by computed key', () => {
    const items = [{ type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 3 }];
    const result = groupBy(items, (item) => item.type);
    expect(result.a).toHaveLength(2);
    expect(result.b).toHaveLength(1);
  });

  it('returns empty object for empty array', () => {
    expect(groupBy([], (item) => item)).toEqual({});
  });
});

describe('chunk', () => {
  it('splits array into pieces of given size', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns empty array when input is empty', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('throws on zero size (edge case)', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(TypeError);
  });
});

describe('deepClone', () => {
  it('deep clones nested objects and arrays (no shared references)', () => {
    const original = { a: 1, nested: { b: [1, 2, { c: 3 }] } };
    const clone = deepClone(original);
    clone.nested.b[2].c = 999;
    expect(original.nested.b[2].c).toBe(3);
  });

  it('clones Date objects into a new Date instance', () => {
    const date = new Date('2026-01-01');
    const clone = deepClone(date);
    expect(clone).not.toBe(date);
    expect(clone.getTime()).toBe(date.getTime());
  });

  it('returns primitives unchanged (edge case)', () => {
    expect(deepClone(5)).toBe(5);
    expect(deepClone(null)).toBe(null);
  });
});

describe('memoize', () => {
  it('calls the original function only once per unique argument set', () => {
    const fn = vi.fn((x) => x * 2);
    const memoized = memoize(fn);
    memoized(3);
    memoized(3);
    memoized(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('computes a fresh result for different arguments', () => {
    const fn = vi.fn((x) => x * 2);
    const memoized = memoize(fn);
    expect(memoized(2)).toBe(4);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('counter', () => {
  it('increments and decrements independently per instance (closure)', () => {
    const c1 = counter();
    const c2 = counter(10);
    c1.inc();
    c1.inc();
    c2.dec();
    expect(c1.value()).toBe(2);
    expect(c2.value()).toBe(9);
  });

  it('starts from zero by default (edge case)', () => {
    const c = counter();
    expect(c.value()).toBe(0);
  });
});
