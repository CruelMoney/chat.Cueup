import express from 'express';
import messageRoutes from './message.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// // mount auth routes at /auth
// router.use('/auth', authRoutes);

// // mount user routes at /api/users
// router.use('/api/users', userRoutes);

// mount message routes at /api/messages
router.use('/api/messages', messageRoutes);

export default router;
