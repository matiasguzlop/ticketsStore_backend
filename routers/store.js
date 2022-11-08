const storeRouter = require('express').Router();
const { readState, setState } = require('../controllers/store');

storeRouter.get('/state', readState);
storeRouter.post('/state', setState);

module.exports = storeRouter;
