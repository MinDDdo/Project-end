import jwt from 'jsonwebtoken';
import config from '../common/config';


export const createToken = (data: any, expiresIn: string) => {
    const token = jwt.sign(
        data, 
        config.jwt.secret_key || '', 
        { 
            expiresIn: expiresIn 
        }
    );

    return token;
}