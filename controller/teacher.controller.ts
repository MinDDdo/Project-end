import {Response, Request} from 'express';
import teacherModel from '../schemas/teacher.schema';
import { response } from '../common/response';
import { handleError } from '../helpers/handleError';
import bcrypt from 'bcrypt';

export const createUser = async(req:Request, res:Response) => {
    try {
        const { firstname, lastname, dob, gender, email, password } = req.body;

        // ENCRYPT PASSWORD
        const salt = await bcrypt.genSalt();
        const encryptPassword = await bcrypt.hash(password, salt);
        
        await teacherModel.create({
            firstname: firstname,
            lastname: lastname,
            dob: dob,
            gender: gender,
            email: email,
            password: encryptPassword 
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

        const { firstname, lastname, dob, gender, line_contact, phone_contact, image } = req.body;

        await teacherModel.updateOne({ _id: id }, { 
            firstname: firstname,
            lastname: lastname,
            dob: dob,
            gender: gender,
            line_contact: line_contact,
            phone_contact: phone_contact,
            image: image
        });
        
        response(res,200, "success", "Update new user done",null);
    }catch (error) {
        console.log(error);

        handleError(res, error);
    }
}

export const getTeacherById = async (req: Request, res: Response) => {
    try {
        const { teacher_id } = req.params;

        const teacher = await teacherModel.findById({ _id: teacher_id })

        if (!teacher) {
            return response(res,404, "fail", "Not found",null);
        }

        const teacherObj = {
            firstname: teacher.firstname,
            lastname: teacher.lastname,
            dob: teacher.dob,
            gender: teacher.gender,
            line_contact: teacher.line_contact,
            phone_contact: teacher.phone_contact,
            image: teacher.image
        }

        response(res,200, "success", "Find teacher",teacherObj)
    }catch (error) {
        console.log(error);
        handleError(res, error);
    }
}

