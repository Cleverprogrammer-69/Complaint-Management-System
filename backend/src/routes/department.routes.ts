import {Router} from 'express';
import type {Express} from 'express';
import { createDepartment, getDepartment, getDepartments, deleteDepartment, updateDepartment } from '../controllers/department.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { hasRole } from '../middlewares/hasRole.middleware.js';

const router = Router();
const app: Express = router as any;
app.use(authMiddleware, hasRole(['ADMIN']));

router.post('/new', createDepartment);

router.get('/', getDepartments);
router.route('/:id').get(getDepartment).put(updateDepartment).delete(deleteDepartment);
export default router;