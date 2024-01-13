import { Response, Request, NextFunction } from 'express';
import { response } from '../common/response';
import jwt from 'jsonwebtoken';
import config from '../common/config';

export default function validateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response(res, 401, 'fail', 'Access denied. No token provided.', null);
    }

    const token = authHeader.substring(7);

    jwt.verify(token, config.jwt.secret_key || '', (err) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return response(res, 403, 'fail', 'Invalid token.', null);
            }
        
            if (err.name === 'TokenExpiredError') {
                return response(res, 401, 'fail', 'Token has expired.', null);
            }
        
            return response(res, 500, 'fail', 'Internal Server Error', null);
        }

        next();
    })
} 