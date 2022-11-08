const router = require('express').Router();

const {
  newCart,
  getByUserId,
  updateProduct,
  deleteProduct,
  emptyCart,
  addProduct,
} = require('../controllers/carts');

router.post('/new', newCart);
router.get('/byUserId', getByUserId);
router.post('/updateProduct', updateProduct);
router.delete('/deleteProduct', deleteProduct);
router.delete('/empty', emptyCart);
router.post('/addProduct', addProduct);
module.exports = router;
