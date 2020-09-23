const getBooks = async function (req, res) {
  const { dataStore } = req.app.locals;
  const books = await dataStore.getAllBooks();
  res.send(JSON.stringify(books));
};

module.exports = { getBooks };
