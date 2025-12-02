// routes/memories.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/memoryController');

router.use(auth); // all memory routes require auth

router.post('/', ctrl.createMemory);
router.get('/', ctrl.getUserMemories);
router.get('/:id', ctrl.getMemory);
router.put('/:id', ctrl.updateMemory);
router.delete('/:id', ctrl.deleteMemory);

module.exports = router;
