const express = require('express');
const fileupload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const cookieParser = require('cookie-parser');
const { getRedisClient } = require('./redisClient.js');
const { ImageStorage } = require('./imageStorage');
const path = require('path');
const { DataStore } = require('./dataStore');
const dotenv = require('dotenv');
dotenv.config();

const {
  CLIENT_ID,
  CLIENT_SECRET,
  DASHBOARD_URL,
  CLOUD_NAME,
  CLOUD_SECRET,
  CLOUD_KEY,
} = process.env;

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
  isLibrarian,
  addBook,
} = require('./handleBooks');

const app = express();

app.locals.client_id = CLIENT_ID;
app.locals.client_secret = CLIENT_SECRET;
app.locals.dashboardUrl = DASHBOARD_URL;
app.locals.dataStore = new DataStore(getRedisClient());
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_KEY,
  api_secret: CLOUD_SECRET,
});
app.locals.imageStorage = new ImageStorage(cloudinary);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(fileupload());

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
app.get('/api/isLibrarian', isLibrarian);
app.post('/api/addBook', addBook);

app.post('/logOut', closeSession);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});

module.exports = { app };
