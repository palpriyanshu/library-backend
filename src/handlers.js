const closeSession = async function (req, res) {
  const { name } = req.cookies;
  const { dataStore } = req.app.locals;
  await dataStore.deleteId(`sess${name}`);
  res.clearCookie('name');
  res.redirect('/');
};

module.exports = { closeSession };
