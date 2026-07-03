import { Router } from 'express';
import type { Express } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { assignJobToResolver, getAllResolversWithJobs, getMyAllTasks, getOneResolverTasks, getOneResolverWithJobsById } from '../controllers/resolver.controllers.js';
import { hasRole } from '../middlewares/hasRole.middleware.js';
const router = Router();
const app: Express = router as any;
app.use(authMiddleware)

router.put('/:resolverId/assignments', hasRole(['ADMIN']), assignJobToResolver);
router.get('/', hasRole(['ADMIN']), getAllResolversWithJobs);
router.get('/:resolverId', hasRole(['ADMIN', 'RESOLVER']), getOneResolverWithJobsById);
router.get('/:resolverId/tasks', hasRole(['ADMIN']), getOneResolverTasks);
router.get('/tasks/me', hasRole(['RESOLVER', 'ADMIN']), getMyAllTasks);
export default router;