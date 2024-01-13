import { Router } from 'express';
import { login, refreshToken } from '../controller/authen.controller';

const router = Router();

router.post('/login', login);
router.post('/refresh_token', refreshToken);

export default router;