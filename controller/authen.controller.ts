import { Response, Request } from 'express';
import teacherModel from '../schemas/teacher.schema';
import { response } from '../common/response';
import { handleError } from '../helpers/handleError';
import { createToken } from '../helpers/handleJWT';
import jwt from 'jsonwebtoken';
import config from '../common/config';

const ACCESS_TOKEN_EXPIRED = '1hr';
const REFRESH_TOKEN_EXPIRED = '7D';


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const teacher = await teacherModel.findOne({ email: email, password: password });

        if (!teacher) {
            return response(res, 404, "fail", "Invalid email or password", null);
        }

        const access_token = createToken({ id: teacher._id }, ACCESS_TOKEN_EXPIRED);

        const refresh_token = createToken({ id: teacher._id }, REFRESH_TOKEN_EXPIRED);

        await teacherModel.updateOne({ _id: teacher._id }, {
            refresh_token: refresh_token
        });

        const token = {
            access_token: access_token,
            refresh_token: refresh_token
        }

        response(res, 200, 'success', "Login success", token);
    } catch (error) {
        handleError(res, error);
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refresh_token } = req.body;

        jwt.verify(refresh_token, config.jwt.secret_key || '', async (err: jwt.VerifyErrors | null) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return  response(res, 403, 'fail', "Invalid refresh token.", null);
                }

                if (err.name === 'TokenExpiredError') {
                    return response(res, 401, 'fail', 'Refresh token has expired.', null);
                }

                return response(res, 500, 'fail', 'Internal Server Error', null);
            }
            
            const refreshToken = await teacherModel.findOne({ refresh_token: refresh_token });
            
            if (!refreshToken) {
                return response(res, 401, 'fail', "Cannot refresh token.", null);
            }
            
            const decodeToken = jwt.decode(refresh_token);
            const teacher_id = (decodeToken as jwt.JwtPayload).id;
            const access_token = createToken({ id: teacher_id }, ACCESS_TOKEN_EXPIRED);

            const data = {
                access_token: access_token
            }

            response(res, 200, 'success', 'Refresh token success.', data);
        });
    } catch (error) {
        handleError(res, error);
    }
}

