import util from 'util';

class Range {
  #from = null;
  #to = null;

  constructor(from, to) {
    this.#from = from;
    this.#to = to;
  }

  [Symbol.iterator]() {
    if (this.#to < this.#from) {
      throw new Error('Invalid range boundaries');
    }

    return {
      current: this.#from,
      last: this.#to,
      next() {
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        }
        return { done: true };
      },
    };
  }

  [util.inspect.custom]() {
    return Array.from(this);
  }

  toJSON() {
    return {
      from: this.#from,
      to: this.#to,
    };
  }
}

const range = new Range(0, 5);

console.log(range);
console.log(JSON.stringify(range, null, 2));
