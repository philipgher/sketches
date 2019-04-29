const express = require('express');

const app = express();
const port = 3000;

app.use('/', express.static('./dist', {
  index: 'index.html',
}));

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App listening on port ${port}`));
