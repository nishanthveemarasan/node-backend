import express from 'express';
import AuthController from '../controllers/auth.js';

const router = express.Router();

router.post('/login',AuthController.login);
router.post('/register',AuthController.signUp);

export default router;