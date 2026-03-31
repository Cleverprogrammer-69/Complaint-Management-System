import {Router} from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, login, logout, refresh, updateUser } from '../controllers/user.controllers.js';
import { hasRole } from '../middlewares/hasRole.middleware.js';

const router = Router();
router.post('/new', hasRole(["ADMIN"]), createUser);
router.get('/', hasRole(["ADMIN"]), getAllUsers);
router.route('/:id')
.get(hasRole(["ADMIN"]), getUserById)
.put(hasRole(["ADMIN"]), updateUser)
.delete(hasRole(["ADMIN"]), deleteUser);
router.post('/login', login);
router.post('/logout', logout);
router.route('/refresh').get(refresh);
export default router;