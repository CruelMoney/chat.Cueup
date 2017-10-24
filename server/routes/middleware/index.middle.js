import express from 'express';
import authMiddle from './auth0.middle';

const router = express.Router(); // eslint-disable-line new-cap

// authorize all api calls
router.use('/api', authMiddle);

export default router;
