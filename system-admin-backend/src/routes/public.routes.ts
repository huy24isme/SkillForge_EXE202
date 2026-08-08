import { Router } from 'express';
import {
  createCheckout,
  handlePayOSWebhook,
  checkOrderStatus,
  simulatePayment,
  cancelOrder,
} from '../controllers/checkout.controller';
import { createCustomLead } from '../controllers/customLead.controller';
import { getPublicReviews, createPublicReview, likePublicReview } from '../controllers/review.controller';

const router = Router();

// Checkout & Payment Endpoints (Public)
router.post('/checkout', createCheckout);
router.post('/webhooks/payos', handlePayOSWebhook);
router.get('/orders/:orderCode/status', checkOrderStatus);
router.post('/simulate-payment', simulatePayment);
router.post('/orders/cancel', cancelOrder);
router.post('/custom-leads', createCustomLead);

// Reviews Endpoints (Public)
router.get('/reviews', getPublicReviews);
router.post('/reviews', createPublicReview);
router.post('/reviews/:id/like', likePublicReview);

export default router;
