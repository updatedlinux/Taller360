const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/register-taller', asyncHandler(authController.registerTaller));

module.exports = router;
