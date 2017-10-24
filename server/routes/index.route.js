import express from 'express';
import apiRoutes from './apiRoutes/index.route';
import middleware from './middleware/index.middle'

const router = express.Router(); // eslint-disable-line new-cap

// Hook middleware
router.use(middleware);

// mount apiRoutes routes at /
router.use('/', apiRoutes);

export default router;
