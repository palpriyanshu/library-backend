const getBooks = async function (req, res) {
  const { dataStore } = req.app.locals;
  const books = await dataStore.getBooks();
  console.log(books);
};

module.exports = { getBooks };
