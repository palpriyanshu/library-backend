const { fetchBook } = require('./bookFetcher.js');

const getBooks = async function (req, res) {
  const { dataStore } = req.app.locals;
  const books = await dataStore.getAllBooks();
  res.send(JSON.stringify(books));
};

const registerBookToUser = async function (req, res) {
  const { id } = req.body;
  const { userId, dataStore } = req.app.locals;
  await dataStore.registerBookToUser(userId, id);
  res.send(JSON.stringify({ status: true }));
};

const getMyBooks = async function (req, res) {
  const { userId, dataStore } = req.app.locals;
  const myBooks = await dataStore.getUserBooks(userId);
  res.send(JSON.stringify(myBooks));
};

const getBook = async function (req, res) {
  const { dataStore } = req.app.locals;
  const { id } = req.params;
  const booksDetails = await dataStore.getBookDetail(id);
  res.send(booksDetails);
};

const returnBook = async function (req, res) {
  const { id } = req.body;
  const { userId, dataStore } = req.app.locals;
  await dataStore.returnBook(userId, id);
  res.json({ status: true });
};

const addBook = async function (req, res) {
  const { bookId } = req.body;
  const { dataStore } = req.app.locals;
  const book = await fetchBook(bookId);
  book.isAvailable = true;
  await dataStore.addBook(bookId, book);
  res.json({ status: true });
};

module.exports = {
  getBooks,
  registerBookToUser,
  getMyBooks,
  getBook,
  returnBook,
  addBook,
};
