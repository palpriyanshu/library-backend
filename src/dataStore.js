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
        this.client.set(`sess_${sessId}`, userName, () => {
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

  registerBookToUser(user, bookId) {
    return new Promise((resolve) => {
      this.client.hmset(user, `book_${bookId}`, bookId, (err, result) => {
        this.client.hmset(`book_${bookId}`, 'isAvailable', false, resolve);
      });
    });
  }

  getUserBooks(user) {
    return new Promise((resolve) => {
      const multi = this.client.multi();
      this.client.hgetall(user, (err, userDetails) => {
        const usersBooks = Object.keys(userDetails).filter((key) =>
          key.includes('book_')
        );
        const result = usersBooks.reduce(
          (m, bookId) => m.hgetall(bookId),
          multi
        );
        result.exec((err, res) => {
          resolve(res);
        });
      });
    });
  }

  getBookDetail(id) {
    return new Promise((resolve) => {
      this.client.hgetall(`book_${id}`, (err, result) => resolve(result));
    });
  }

  returnBook(userId, bookId) {
    return new Promise((resolve) => {
      this.client.hdel(userId, `book_${bookId}`, (err, result) => {
        this.client.hmset(`book_${bookId}`, 'isAvailable', true, resolve);
      });
    });
  }
}

module.exports = { DataStore };
