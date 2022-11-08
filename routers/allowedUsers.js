const router = require('express').Router();
const {
  create,
  readAll,
  updateById,
  deleteById,
} = require('../controllers/allowedUsers');

router.post('/new', create);
router.get('/all', readAll);
router.post('/update', updateById);
router.delete('/byId', deleteById);

module.exports = router;
