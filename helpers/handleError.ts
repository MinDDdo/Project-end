import { Response } from 'express';
import { response } from '../common/response';

export const handleError = (res:Response, error:any) => {
    if (error instanceof Error) {
        if (error.name === 'MongoServerError') {
            if (error.message.startsWith("E1100 duplicate kuy error")) {
                return response(res, 422, "failed", "Email is duplicate.", null)
            }
        }

       
        return response(res, 500, "failed", error.message, null); 
    }
    return response(res,500, "failed", "Internal Server Error.", null);
}