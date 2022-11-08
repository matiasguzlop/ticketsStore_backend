const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const accountsRouter = require('./routers/accounts');
const productRouter = require('./routers/products');
const cartsRouter = require('./routers/carts');
const ordersRouter = require('./routers/orders');
const storeRouter = require('./routers/store');

app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/accounts', accountsRouter);
app.use('/products', productRouter);
app.use('/carts', cartsRouter);
app.use('/orders', ordersRouter);
app.use('/store', storeRouter);

const DB_CONN_URL = process.env.NODE_ENV === 'test' ? process.env.DB_URL_TEST : process.env.DB_URL_DEV;
mongoose.connect(DB_CONN_URL).then(() => {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT, () => {
      console.log('Server is running');
    });
  }
});

module.exports = {
  app,
};
