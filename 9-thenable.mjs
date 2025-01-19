class Thenable {
  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  }

  ready(data) {
    if (this.onFulfilled) this.onFulfilled(data);
  }

  throw(err) {
    if (this.onRejected) this.onRejected(err);
  }
}

class UserQuery {
  #limit = null;
  #offset = null;
  #sort = null;
  #where = {};

  limit(limit) {
    this.#limit = limit;
    return this;
  }

  offset(offset) {
    this.#offset = offset;
    return this;
  }

  sort(sort) {
    this.#sort = sort;
    return this;
  }

  exect() {
    let query = `SELECT * FROM 'users'`;

    if (this.#offset != null) {
      query += ` OFFSET ${this.#offset}`;
    }

    if (this.#limit) {
      query += ` LIMIT ${this.#limit}`;
    }

    if (this.#sort) {
      query += ` ORDER BY ${this.#sort}`;
    }

    const thenable = new Thenable();

    setTimeout(() => {
      thenable.throw(new Error('user not found!'));
      thenable.ready(query);
    }, 1000);

    return thenable;
  }
}

(async function () {
  const query = new UserQuery().limit(10).offset(0).sort('id').exect();

  try {
    const data = await query;
    console.dir(data);
  } catch (err) {
    console.log(err);
  }
})();
