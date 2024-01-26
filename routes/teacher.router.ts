import {Router} from 'express';
import validToken from '../middlewares/authenJWT';
import { createUser, updateUser } from '../controller/teacher.controller'

const router = Router();

router.post('/signup', createUser);
router.put('/update/:user_id', validToken, updateUser);

export default router;