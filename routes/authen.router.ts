import { Router } from 'express';
import { login, refreshToken, joinClassroom, refreshTokenStudent } from '../controller/authen.controller';

const router = Router();

router.post('/login', login);
router.post('/refresh_token', refreshToken);
router.post('/join-classroom', joinClassroom);
router.post('/refresh-token-student', refreshTokenStudent);


export default router;