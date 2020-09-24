const fetch = require('node-fetch');

const closeSession = async function (req, res) {
  const { dataStore } = req.app.locals;
  const { sessId } = req.cookies;
  await dataStore.deleteSession(sessId);
  res.clearCookie('sessId');
  res.json({ status: true });
};

const getCurrentUserId = async function (req, res, next) {
  const { sessId } = req.cookies;
  const { dataStore } = req.app.locals;
  req.app.locals.userId = await dataStore.getSession(sessId);
  next();
};

const currentUser = async function (req, res) {
  const { dataStore } = req.app.locals;
  const { sessId } = req.cookies;
  let sessionId = null;
  if (sessId) {
    sessionId = await dataStore.getSession(sessId);
  }
  const user = sessionId ? await dataStore.getUser(sessionId) : null;
  res.json(user);
};

const redirectToGithub = async function (req, res) {
  const { client_id, dataStore } = req.app.locals;
  const { sessId } = req.cookies;
  let sessionId = null;
  if (sessId) {
    sessionId = await dataStore.getSession(sessId);
  }

  if (sessionId) {
    res.redirect('http://localhost:3000/library/category/All');
    return;
  }
  const url = 'https://github.com/login/oauth/authorize';
  const redirectUri = 'http://localhost:3002/gitOauth/authCode';
  res.redirect(`${url}?client_id=${client_id}&redirect_uri=${redirectUri}`);
  return;
};

const getAccessToken = function (client_id, client_secret, code) {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
  };
  const url = 'https://github.com/login/oauth/access_token';
  const queryParams = `client_id=${client_id}&client_secret=${client_secret}&code=${code}`;
  return fetch(`${url}?${queryParams}`, options).then((reply) => reply.json());
};

const getUserDetails = function (access_token) {
  const options = {
    headers: {
      Authorization: `token ${access_token}`,
    },
  };
  return fetch('https://api.github.com/user', options).then((e) => e.json());
};

const registerUser = async function (res, dataStore, details) {
  const sessId = await dataStore.createSession(details.login);
  await dataStore.registerUser(details);
  res.cookie('sessId', sessId);
  res.redirect('http://localhost:3000/library/category/All');
};

const authenticateUser = function (req, res) {
  const { client_id, client_secret, dataStore } = req.app.locals;
  const { code } = req.query;
  getAccessToken(client_id, client_secret, code).then(({ access_token }) => {
    getUserDetails(access_token).then((userDetails) => {
      registerUser(res, dataStore, userDetails);
    });
  });
};

module.exports = {
  currentUser,
  redirectToGithub,
  authenticateUser,
  getCurrentUserId,
  closeSession,
};
