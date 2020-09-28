const express = require('express');
const cookieParser = require('cookie-parser');
const { getRedisClient } = require('./redisClient.js');
const path = require('path');
const { DataStore } = require('./dataStore');
const dotenv = require('dotenv');
dotenv.config();
const { CLIENT_ID, CLIENT_SECRET, DASHBOARD_URL } = process.env;

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

app.locals.client_id = CLIENT_ID;
app.locals.client_secret = CLIENT_SECRET;
app.locals.react_server = DASHBOARD_URL;
app.locals.dataStore = new DataStore(getRedisClient());

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
app.post('/addBook/:id', addBook);

app.post('/logOut', closeSession);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});

module.exports = { app };
