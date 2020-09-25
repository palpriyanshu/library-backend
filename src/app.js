const express = require('express');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const { DataStore } = require('./dataStore');
const { CLIENT_ID, CLIENT_SECRET } = process.env;

const {
  currentUser,
  redirectToGithub,
  authenticateUser,
  getCurrentUserId,
  closeSession,
} = require('./handleOAuth');

const {
  getBooks,
  registerBookToUser,
  getMyBooks,
  getBook,
  returnBook,
  addBook,
} = require('./handleBooks');

const app = express();

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379',
  db: 2,
});

app.locals.client_id = CLIENT_ID;
app.locals.client_secret = CLIENT_SECRET;
app.locals.dataStore = new DataStore(client);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.get('/user', currentUser);
app.get('/api/authenticate', redirectToGithub);
app.get('/gitOauth/authCode', authenticateUser);
app.use(getCurrentUserId);

app.get('/getBooks', getBooks);
app.get('/getBook/:id', getBook);
app.get('/myBooks', getMyBooks);
app.post('/registerBookToUser', registerBookToUser);
app.post('/returnBook', returnBook);
app.post('/addBook', addBook);

app.post('/logOut', closeSession);

module.exports = { app };
