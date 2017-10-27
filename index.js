const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use((req, res, next) => {
  let { latency } = req.query;

  if (!latency) {
    return next();
  }

  setTimeout(next, latency);
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

[
  { file: '/sw.basic.js', dir: 'sw' },
  { file: '/sw.slow.js', dir: 'sw' },
  { file: '/sw.cache.js', dir: 'sw' },
  { file: '/basic.html', dir: 'html', route: '/' },
  { file: '/cache.html', dir: 'html', route: '/cache' },
  { file: '/slow.html', dir: 'html', route: '/slow' },
].forEach(({ file, dir, route }) => {
  app.get(route || file, (req, res, next) => {
    res.sendFile(path.join(__dirname, dir, file));
  });
});

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.listen(3000);
