import { Response, Request } from 'express';
import classroomModel from '../schemas/classroom.schema';
import studentModel from '../schemas/student.schema';
import assignmentModel from '../schemas/assignment.schema';
import attendanceModel from '../schemas/attendance.schema';
import { response } from '../common/response';
import { handleError } from '../helpers/handleError';
import { v4 as uuidv4 } from 'uuid';

export const createClassroom = async(req:Request, res:Response) => {
    
    try {
        const { name, owner } = req.body;

        // Generate classroom code
        const uuid = uuidv4();
        const classroomCode = uuid.substring(0, 6);

        await classroomModel.create({
            name: name,
            owner: owner,
            code: classroomCode
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
        const { teacher_id } = req.params;

        const classroom = await classroomModel.aggregate([
            {
                $match: { owner: teacher_id }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    code: 1,
                    owner: 1
                }
            }
        ])

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
        const classroomObj = {
            id: classroom._id,
            name: classroom.name,
            code: classroom.code,
            owner: classroom.owner
        }
        response(res,200, "success", "Find Classroom",classroomObj);
        
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

        const classroom = await classroomModel.deleteOne({ _id: classroomId});

        if (classroom.deletedCount === 0) {
            return response(res,200, "fail", "Not founded classroom", null);
        }

        await studentModel.deleteMany({ classroom_id: classroomId });
        await attendanceModel.deleteMany({ classroom_id: classroomId });
        await assignmentModel.deleteMany({ classroom_id: classroomId });

        response(res,200, "success", "Delete Classroom",null);
    }catch (error) {
        console.log(error);
        handleError(res, error);
    }
}
