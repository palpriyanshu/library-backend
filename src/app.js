const express = require('express');
// const { getRedisClient } = require('./redisClient');
// const { Client } = require('./dataProvider.js');

const app = express();

// app.locals.client = new Client(getRedisClient());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.get('/api/authenticate/', (req, res) => res.send('hello'));

module.exports = { app };
