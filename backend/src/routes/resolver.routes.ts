import { Router } from 'express';
import type { Express } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { assignJobToResolver, getAllResolversWithJobs } from '../controllers/resolver.controllers.js';
import { hasRole } from '../middlewares/hasRole.middleware.js';
const router = Router();
const app: Express = router as any;
app.use(authMiddleware)

router.put('/:resolverId/assignments', hasRole(['ADMIN']), assignJobToResolver);
router.get('/', hasRole(['ADMIN']), getAllResolversWithJobs);
export default router;
