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
  const { client_id, dashboardUrl } = req.app.locals;
  const { sessId } = req.cookies;
  if (sessId) {
    res.redirect(dashboardUrl);
    return;
  }
  const url = 'https://github.com/login/oauth/authorize';

  res.redirect(`${url}?client_id=${client_id}`);
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

const registerUser = async function (req, res, details) {
  const { dataStore, dashboardUrl } = req.app.locals;
  const user = await dataStore.getUser(details.login);
  if (!user) {
    await dataStore.registerUser(details);
  }
  const sessId = await dataStore.createSession(details.login);
  res.cookie('sessId', sessId);
  res.redirect(dashboardUrl);
};

const authenticateUser = function (req, res) {
  const { client_id, client_secret } = req.app.locals;
  const { code } = req.query;
  getAccessToken(client_id, client_secret, code).then(({ access_token }) => {
    getUserDetails(access_token).then(async (userDetails) => {
      registerUser(req, res, userDetails);
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
