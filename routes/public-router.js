import express from 'express';
import authRouter from './auth.js';
import webhookRouter from './webhook.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the public API' });
});

router.use('/auth', authRouter);
router.use('/webhook', webhookRouter);


export default router;