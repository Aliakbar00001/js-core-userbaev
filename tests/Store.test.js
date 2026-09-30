import { describe, it, expect } from 'vitest';
import { Store, SortedStore } from '../src/Store.js';

describe('Store', () => {
  it('adds items and computes total as sum of price * qty', () => {
    const store = new Store();
    store.add({ name: 'Skis', price: 50000, qty: 1 });
    store.add({ name: 'Helmet', price: 8000, qty: 2 });
    expect(store.total).toBe(50000 + 8000 * 2);
  });

  it('total is zero for an empty store (edge case)', () => {
    const store = new Store();
    expect(store.total).toBe(0);
  });

  it('finds an item by name', () => {
    const store = new Store();
    store.add({ name: 'Gloves', price: 3000, qty: 1 });
    expect(store.find('Gloves').price).toBe(3000);
  });

  it('returns undefined when item is not found (edge case)', () => {
    const store = new Store();
    expect(store.find('Nope')).toBeUndefined();
  });

  it('removes an item by name', () => {
    const store = new Store();
    store.add({ name: 'Goggles', price: 4000, qty: 1 });
    store.remove('Goggles');
    expect(store.find('Goggles')).toBeUndefined();
  });

  it('throws when adding an item without a valid name (wrong type)', () => {
    const store = new Store();
    expect(() => store.add({ price: 100, qty: 1 })).toThrow(TypeError);
  });

  it('items getter returns a copy, not the internal private array', () => {
    const store = new Store();
    store.add({ name: 'Poles', price: 5000, qty: 1 });
    const snapshot = store.items;
    snapshot.push({ name: 'Fake', price: 0, qty: 0 });
    expect(store.items).toHaveLength(1);
  });

  it('static fromArray builds a Store from a plain array', () => {
    const store = Store.fromArray([
      { name: 'Jacket', price: 15000, qty: 1 },
      { name: 'Pants', price: 12000, qty: 1 },
    ]);
    expect(store.total).toBe(27000);
  });
});

describe('SortedStore', () => {
  it('returns items sorted by price ascending, overriding the parent getter', () => {
    const store = new SortedStore();
    store.add({ name: 'Board', price: 90000, qty: 1 });
    store.add({ name: 'Wax', price: 2000, qty: 1 });
    store.add({ name: 'Bindings', price: 25000, qty: 1 });
    const prices = store.items.map((item) => item.price);
    expect(prices).toEqual([2000, 25000, 90000]);
  });

  it('still computes total correctly (inherited getter, unaffected by sorting)', () => {
    const store = new SortedStore();
    store.add({ name: 'A', price: 100, qty: 2 });
    store.add({ name: 'B', price: 50, qty: 1 });
    expect(store.total).toBe(250);
  });
});
