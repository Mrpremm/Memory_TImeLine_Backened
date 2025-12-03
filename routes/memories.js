// backend/routes/memories.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware'); // JWT middleware
const ctrl = require('../controllers/memoryController'); // controller with functions

// Create memory (protected)
router.post('/', auth, ctrl.createMemory);

// Get logged-in user's memories (protected)
router.get('/', auth, ctrl.getMyMemories);
// Update memory (protected)
router.put('/:id', auth, ctrl.updateMemory);

// Delete memory (protected)
router.delete('/:id', auth, ctrl.deleteMemory);
module.exports = router;
