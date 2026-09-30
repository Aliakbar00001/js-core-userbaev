// src/Store.js
// Часть 2 — класс Store с приватными полями, геттером и статическим методом,
// плюс SortedStore, наследующий Store и переопределяющий геттер items.

export class Store {
  #items = [];

  /**
   * Добавляет товар { name, price, qty } в магазин.
   * @param {{name: string, price: number, qty: number}} item
   * @returns {Store} this, для цепочки вызовов
   */
  add(item) {
    if (!item || typeof item.name !== 'string') {
      throw new TypeError('item must have a string name');
    }
    this.#items.push(item);
    return this;
  }

  /**
   * Удаляет товар по имени.
   * @param {string} name
   * @returns {Store} this
   */
  remove(name) {
    this.#items = this.#items.filter((item) => item.name !== name);
    return this;
  }

  /**
   * Находит товар по имени.
   * @param {string} name
   * @returns {{name: string, price: number, qty: number}|undefined}
   */
  find(name) {
    return this.#items.find((item) => item.name === name);
  }

  /**
   * Копия текущего списка товаров (наружу приватное поле не отдаём напрямую).
   * @returns {Array}
   */
  get items() {
    return [...this.#items];
  }

  /**
   * Геттер: сумма price * qty по всем товарам.
   * @returns {number}
   */
  get total() {
    return this.#items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  /**
   * Статический метод: создать Store сразу из массива товаров.
   * @param {Array} arr
   * @returns {Store}
   */
  static fromArray(arr) {
    const store = new Store();
    arr.forEach((item) => store.add(item));
    return store;
  }
}

/**
 * SortedStore держит товары отсортированными по цене. Переопределяем геттер
 * items и внутри вызываем super.items, чтобы не трогать приватное поле #items
 * родителя напрямую (оно недоступно из подкласса — это и есть смысл #).
 */
export class SortedStore extends Store {
  get items() {
    return [...super.items].sort((a, b) => a.price - b.price);
  }
}
