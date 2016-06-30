const app = require('./src/app');

app.start().then(() =>
  console.log(`Application listening on port ${app.config.get('port')}`)
).catch(e => console.error(e));
