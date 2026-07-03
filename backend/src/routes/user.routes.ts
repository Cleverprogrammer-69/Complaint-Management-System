import {Router} from 'express';
import type { Express } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, login, logout, refresh, updateUser } from '../controllers/user.controllers.js';
import { hasRole } from '../middlewares/hasRole.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
const app: Express = router as any;
router.post('/login', login);
router.post('/logout', logout);
router.route('/refresh').get(refresh);
app.use(authMiddleware)
router.post('/new', hasRole(["ADMIN"]), createUser);

router.get('/', hasRole(["ADMIN"]), getAllUsers);
router.route('/:id')
.get(hasRole(["ADMIN"]), getUserById)
.put(hasRole(["ADMIN"]), updateUser)
.delete(hasRole(["ADMIN"]), deleteUser);
export default router;