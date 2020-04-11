require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const indexControllers = require('./controllers/index');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// adds `.body` in the request
app.use(bodyParser.json({ extended: false }));

app.use('/api', indexControllers);

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/client')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'))
//   })
// }

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
