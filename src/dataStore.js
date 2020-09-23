class DataStore {
  constructor(client) {
    this.client = client;
  }

  incrID(idName) {
    return new Promise((resolve) => {
      this.client.incr(idName, (err, incrementedID) => {
        resolve(incrementedID);
      });
    });
  }

  createSession(userName) {
    return new Promise((resolve) => {
      this.incrID('sessId').then((sessId) =>
        this.client.set(`sess_${sessId}`, userName, 'EX', 2592000, () => {
          resolve(sessId);
        })
      );
    });
  }

  getSession(sessId) {
    return new Promise((resolve) => {
      this.client.get(`sess_${sessId}`, (err, userName) => {
        resolve(userName);
      });
    });
  }

  getUser(userName) {
    return new Promise((resolve) => {
      this.client.hgetall(userName, (err, result) => resolve(result));
    });
  }

  registerUser(details) {
    return new Promise((resolve) => {
      this.client.hmset(
        details.login,
        'name',
        details.name,
        'avatarUrl',
        details.avatar_url,
        resolve
      );
    });
  }

  deleteSession(sesId) {
    return new Promise((resolve) => {
      this.client.del(`sess_${sesId}`, resolve);
    });
  }

  addBook(key, fieldValuePairs) {
    console.log(key);
    return new Promise((resolve) => {
      this.client.hmset(`book_${key}`, fieldValuePairs, resolve);
    });
  }

  getAllBooks() {
    return new Promise((resolve) => {
      const multi = this.client.multi();
      this.client.keys('book*', (err, books) => {
        const result = books.reduce(
          (m, bookName) => m.hgetall(bookName),
          multi
        );
        result.exec((err, res) => {
          resolve(res);
        });
      });
    });
  }
}

module.exports = { DataStore };
