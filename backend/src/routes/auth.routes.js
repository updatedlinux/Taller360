const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/login', asyncHandler(authController.login));
router.post('/logout', authController.logout);
router.post('/register-taller', asyncHandler(authController.registerTaller));
router.get('/me', requireAuth, asyncHandler(authController.me));

module.exports = router;
