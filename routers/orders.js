const router = require('express').Router();

const {
  newOrder,
  getById,
  getByUserId,
  getAll,
  updateStatus,
  deleteById,
} = require('../controllers/orders');

router.post('/new', newOrder);
router.get('/byId', getById);
router.get('/byUserId', getByUserId);
router.get('/all', getAll);
router.post('/update', updateStatus);
router.delete('/byId', deleteById);

module.exports = router;
