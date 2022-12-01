const router = require('express').Router();

const {
  newOrder,
  getById,
  getByUserId,
  getAll,
  updateStatus,
  deleteById,
  exportExcel,
} = require('../controllers/orders');

router.post('/new', newOrder);
router.get('/byId', getById);
router.get('/byUserId', getByUserId);
router.get('/all', getAll);
router.post('/update', updateStatus);
router.delete('/byId', deleteById);
router.get('/export', exportExcel);

module.exports = router;
