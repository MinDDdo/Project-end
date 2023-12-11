import {Response, Request} from 'express';
import teacherModel from '../schemas/teacher.schema';
import { response } from '../common/response';
import { handleError } from '../helpers/handleError';

export const createUser = async(req:Request, res:Response) => {

    try {
        const { firstname, lastname, dob, gender, email, password } = req.body;
        await teacherModel.create({
            firstname: firstname,
            lastname: lastname,
            dob: dob,
            gender: gender,
            email: email,
            password: password 
        });

        response(res,200, "success", "Singup new user done",null);
    }catch (error) {
        console.log(error);
        
        handleError(res, error);
    }
}
export const updateUser = async(req:Request, res:Response) => {

    try {
        const id = req.params.user_id;

        const { firstname, lastname, dob, gender, line_contact, phone_contact } = req.body;

        await teacherModel.updateOne({ _id: id }, { 
            firstname: firstname,
            lastname: lastname,
            dob: dob,
            gender: gender,
            line_contact: line_contact,
            phone_contact: phone_contact
        });
        
        response(res,200, "success", "Update new user done",null);
    }catch (error) {
        console.log(error);

        handleError(res, error);
    }
}