/* 1eslint-disable */
const express = require('express');
const app = express();
const publicPath = `${__dirname}/dist`;

app.listen(3000, () => {
  console.log(`${__dirname}/dist/index.html`);
  console.log('start! express server on port 3000');
});
app.use(express.static('dist'));

app.get(`/`, (req, res) => {
  res.sendFile(`${publicPath}/index.html`);
});
