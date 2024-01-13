import {Router} from 'express';
import { createUser, updateUser } from '../controller/teacher.controller'

const router = Router();

router.post('/signup', createUser);
router.put('/update/:user_id', updateUser)

export default router;