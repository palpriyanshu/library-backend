const { app } = require('./src/app.js');

app.listen(process.env.PORT || 3002, () => console.log('listening'));
