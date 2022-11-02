const router = require('express').Router();

const {
  createAccount,
  getById,
  updateById,
  removeById,
  login,
  isLogged,
  logout,
} = require('../controllers/accounts');

router.post('/new', createAccount);
router.get('/byId', getById);
router.post('/updateById', updateById);
router.delete('/byId', removeById);
router.post('/login', login);
router.get('/isLogged', isLogged);
router.post('/logout', logout);

module.exports = router;
