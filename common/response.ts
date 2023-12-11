import { Response } from 'express';

export const response = ( res:Response, code:number, status:string, message:string, data:any ) => {
    res.status(code).json ({
        detail: {
            status: status , 
            message: message
        },
        result: {
            data: data
        }
    });
}