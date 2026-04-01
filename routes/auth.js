import express from 'express';
import AuthController from '../controllers/auth.js';
import { loginValidator, refreshTokenValidator, singupValidator } from '../validators/auth-validator.js';
import inputValidateMiddleware from '../middleware/validate.js';
const router = express.Router();

router.post('/login',loginValidator,inputValidateMiddleware,AuthController.login);
router.post('/refresh-access-token',refreshTokenValidator,inputValidateMiddleware,AuthController.refreshAccessToken);
router.post('/register',singupValidator,inputValidateMiddleware,AuthController.signUp);

export default router;