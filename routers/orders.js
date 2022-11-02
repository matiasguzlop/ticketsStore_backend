const router = require('express').Router();

const {
  newOrder,
  getById,
  getByUserId,
  getAll,
  updateStatus,
} = require('../controllers/orders');

router.post('/new', newOrder);
router.get('/byId', getById);
router.get('/byUserId', getByUserId);
router.get('/all', getAll);
router.post('/update', updateStatus);

module.exports = router;
