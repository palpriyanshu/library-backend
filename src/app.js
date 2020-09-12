const express = require('express');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const { DataStore } = require('./dataStore');
const { CLIENT_ID, CLIENT_SECRET } = process.env;

const { redirectToGithub, authenticateUser } = require('./handleOAuth');
const { closeSession } = require('./handlers');

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

app.get('/api/authenticate/', redirectToGithub);

app.get('/gitOauth/authCode', authenticateUser);

app.get('/logOut', closeSession);

module.exports = { app };
