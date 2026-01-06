import {Router} from 'express';
import { createService, getServices, getService, deleteService, updateService } from '../controllers/service.controllers.js';

const router = Router();
router.post('/new', createService);

router.get('/', getServices);
router.route('/:id').get(getService).put(updateService).delete(deleteService);
export default router;