const fetch = require('node-fetch');

const redirectToGithub = function (req, res) {
  const { client_id } = req.app.locals;
  const url = 'https://github.com/login/oauth/authorize';
  const redirectUri = 'http://localhost:3002/gitOauth/authCode';
  res.redirect(`${url}?client_id=${client_id}&redirect_uri=${redirectUri}`);
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

const registerUser = async function (res, dataStore, userDetails) {
  await dataStore.setId(`sess${userDetails.name}`, userDetails.name);
  res.cookie('name', userDetails.name);
  res.end('<button><a href="/logOut"> log out </a></button>');
};

const authenticateUser = function (req, res) {
  const { client_id, client_secret, dataStore } = req.app.locals;
  const { code } = req.query;
  getAccessToken(client_id, client_secret, code).then(({ access_token }) => {
    getUserDetails(access_token).then((userDetails) =>
      registerUser(res, dataStore, userDetails)
    );
  });
};

module.exports = {
  redirectToGithub,
  authenticateUser,
};
