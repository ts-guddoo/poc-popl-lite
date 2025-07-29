import { Router } from 'express';
import { createActivity } from '../controllers/activityController';

const router = Router();

// POST /activities - create activity
router.post('/', createActivity);

export default router; 