const getBooks = async function (req, res) {
  const { dataStore } = req.app.locals;
  const books = await dataStore.getAllBooks();
  res.send(JSON.stringify(books));
};

const registerBookToUser = async function (req, res) {
  const { sessId } = req.cookies;
  const { dataStore } = req.app.locals;
  const { id } = req.body;
  const sessionId = await dataStore.getSession(sessId);
  await dataStore.registerBookToUser(sessionId, id);
  res.send(JSON.stringify({ status: true }));
};

const getMyBooks = async function (req, res) {
  const { sessId } = req.cookies;
  const { dataStore } = req.app.locals;
  const sessionId = await dataStore.getSession(sessId);
  const myBooks = await dataStore.getUserBooks(sessionId);
  res.send(JSON.stringify(myBooks));
};

module.exports = { getBooks, registerBookToUser, getMyBooks };
