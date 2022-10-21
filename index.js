const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const accountRouter = require('./routers/accounts');

app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/accounts', accountRouter);

const DB_CONN_URL = process.env.NODE_ENV === 'test' ? process.env.DB_URL_TEST : process.env.DB_URL_DEV;
mongoose.connect(DB_CONN_URL).then(() => {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT, () => {
      console.log('Server is running');
    });
  }
});

module.exports = app;
