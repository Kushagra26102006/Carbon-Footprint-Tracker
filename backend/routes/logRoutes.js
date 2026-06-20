const express = require('express');
const router = express.Router();

const {
  createLog,
  getLogs,
  deleteLog,
  getAnalyticsSummary,
} = require('../controllers/logController');

const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createLogSchema } = require('../validators/logValidator');

// Apply JWT authentication protection middleware globally across all log endpoints
router.use(protect);

// CRUD Logs management
router.post('/', validate(createLogSchema), createLog);
router.get('/', getLogs);
router.delete('/:id', deleteLog);

// Summary statistics analytics endpoint
router.get('/analytics', getAnalyticsSummary);

module.exports = router;
