import {Router} from 'express';
import WebhookController from '../controllers/webhook.js';

const router = Router();

router.post('/payment-success', WebhookController.paymentSuccess);
router.post('/payment-failed', WebhookController.paymentFailed);

export default router;