import {Router} from 'express';
import validToken from '../middlewares/authenJWT';
import { createUser, updateUser, getTeacherById } from '../controller/teacher.controller'

const router = Router();

router.post('/signup', createUser);
router.put('/update/:user_id', validToken, updateUser);
router.get('/getById/:teacher_id', validToken, getTeacherById);

export default router;