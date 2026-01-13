import { Router } from 'express';
import type { Express } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { assignJobToResolver, getAllResolversWithJobs } from '../controllers/resolver.controllers.js';
const router = Router();
const app: Express = router as any;
app.use(authMiddleware)

router.put('/:resolverId/assignments', assignJobToResolver);
router.get('/', getAllResolversWithJobs);
export default router;
