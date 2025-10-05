import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getAvailablePlugins, activatePlugin, deactivatePlugin } from '../controllers/plugin.controllers.js';

const router = express.Router();

router.use(protect);

router.get('/', getAvailablePlugins);
router.post('/:pluginId/activate', activatePlugin);
router.delete('/:pluginId/deactivate', deactivatePlugin);

export default router;