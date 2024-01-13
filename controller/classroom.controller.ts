import { Response, Request } from 'express';
import classroomModel from '../schemas/classroom.schema';
import { response } from '../common/response';
import { handleError } from '../helpers/handleError';

export const createClassroom = async(req:Request, res:Response) => {
    
    try {
        const { name, owner ,code } = req.body;
        await classroomModel.create({
            name: name,
            owner: owner,
            code: code
        });

        response(res,200, "success", "Create Classroom",null);
    }catch (error) {
        console.log(error);

        handleError(res, error)
    }
}

export const getAllClassroom = async (req:Request, res:Response) => {
    
    try {
        const size = req.query.size;
        const page = req.query.page;
        const teacherId = req.params.teacher_id;

        const classroom = await classroomModel.find({ owner: teacherId})

        response(res,200, "success", "Doo Classrom Ja",classroom);
    }catch (error) {
        console.log(error)

        handleError(res, error);
    }
}

export const getClassroomById = async (req:Request, res:Response) => {

    try {
        const classroomId = req.params.classroom_id;

        const classroom = await classroomModel.findById({_id: classroomId})

        if ( classroom === null ) {
            return response(res,404, "not found", "Not Found Classroom",null);
        }
        response(res,200, "success", "Find Classroom",classroom);
        
    }catch (error) {
        console.log(error)

        handleError(res, error);
    }
}

export const updateClassroomById = async (req:Request, res:Response) => {

    try {
        const classroomId = req.params.classroom_id;
    
        const { name } = req.body;

        await classroomModel.updateOne({ _id: classroomId } ,{
            name: name
        });
        response(res,200, "success", "Update New Classroom Dode",null);

    }catch (error) {
        console.log(error)
        handleError(res, error);
    }
}

export const deleteClassroomById =async (req:Request, res:Response) => {
    
    try {
        const classroomId = req.params.classroom_id;

        await classroomModel.deleteOne({ _id: classroomId})
        response(res,200, "success", "Delete Classroom",null);
    }catch (error) {
        console.log(error);
        handleError(res, error);
    }
}
