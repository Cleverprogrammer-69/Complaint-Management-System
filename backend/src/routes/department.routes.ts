import {Router} from 'express';
import type {Express} from 'express';
import { createDepartment, getDepartment, getDepartments, deleteDepartment, updateDepartment } from '../controllers/department.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { hasRole } from '../middlewares/hasRole.middleware.js';

const router = Router();
const app: Express = router as any;
app.use(authMiddleware);

router.post('/new',hasRole(['ADMIN']), createDepartment);

router.get('/', getDepartments);
router.route('/:id').get(hasRole(['ADMIN']),getDepartment).put(hasRole(['ADMIN']),updateDepartment).delete(hasRole(['ADMIN']),deleteDepartment);
export default router;