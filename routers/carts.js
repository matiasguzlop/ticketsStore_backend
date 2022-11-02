const router = require('express').Router();

const {
  newCart,
  getByUserId,
  updateProduct,
  deleteProduct,
  emptyCart,
} = require('../controllers/carts');

router.post('/new', newCart);
router.get('/byUserId', getByUserId);
router.post('/updateProduct', updateProduct);
router.delete('/deleteProduct', deleteProduct);
router.delete('/empty', emptyCart);
module.exports = router;
