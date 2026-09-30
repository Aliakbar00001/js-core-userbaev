// src/functions.js
// Часть 1 — набор функций с использованием map/filter/reduce, деструктуризации и spread.

/**
 * Возвращает массив без дубликатов.
 * @param {Array} arr
 * @returns {Array}
 */
export function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Группирует элементы массива по ключу, вычисляемому функцией keyFn.
 * @param {Array} arr
 * @param {(item: any) => string|number} keyFn
 * @returns {Object}
 */
export function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    const bucket = groups[key] ?? [];
    return { ...groups, [key]: [...bucket, item] };
  }, {});
}

/**
 * Разбивает массив на куски заданного размера.
 * @param {Array} arr
 * @param {number} size
 * @returns {Array[]}
 */
export function chunk(arr, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new TypeError('size must be a positive integer');
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Глубокая копия объектов, массивов и Date. Без JSON.parse(JSON.stringify()).
 * @param {*} value
 * @returns {*}
 */
export function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, deepClone(val)])
  );
}

/**
 * Кэширует результаты вызова функции по её аргументам. Построена на замыкании:
 * переменная cache "запоминается" во внутренней функции между вызовами.
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
  const cache = new Map();
  return function memoized(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Фабрика счётчика. Каждый вызов counter() создаёт свою приватную переменную
 * value, недоступную снаружи напрямую — классический пример замыкания.
 * @param {number} start
 * @returns {{ inc: () => number, dec: () => number, value: () => number }}
 */
export function counter(start = 0) {
  let value = start;
  return {
    inc: () => ++value,
    dec: () => --value,
    value: () => value,
  };
}
