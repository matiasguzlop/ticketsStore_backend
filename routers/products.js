const router = require('express').Router();

const {
  newProduct,
  getById,
  getAll,
  update,
  deleteById,
} = require('../controllers/products');

router.post('/new', newProduct);
router.get('/byId', getById);
router.get('/all', getAll);
router.post('/update', update);
router.delete('/byId', deleteById);

module.exports = router;
