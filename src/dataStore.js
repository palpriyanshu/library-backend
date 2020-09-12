class DataStore {
  constructor(client) {
    this.client = client;
  }

  setId(key, value) {
    return new Promise((resolve) => {
      this.client.set(key, value, resolve);
    });
  }

  deleteId(key) {
    return new Promise((resolve) => {
      this.client.del(key, resolve);
    });
  }
}

module.exports = { DataStore };
