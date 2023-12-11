import { Response, Request } from "express";
import classroomModel from "../schemas/classroom.schema";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";

export const createStudentClassroom = async (req: Request, res: Response) => {
    
    try {
        const classroomId = req.params.classroom_id;
        
        const { student_firstname, student_lastname, student_no } = req.body;

        //  step 1
        //  get classroom
        //  and check field student by condition 
        // if classroom?.student === undefined: update with [studentObj]
        // else classroom?.student !== undefined: update with [...classroom?.student, studentObj]

        // GET classroom by id
        const classroom = await classroomModel.findById({ _id:classroomId })

        // New student
        const studentObj = {
            firstname: student_firstname,
            lastname: student_lastname,
            no: student_no
        };


        if (classroom?.student != undefined) {
            await classroomModel.updateOne({ _id: classroomId}, {
                student: [...classroom?.student, studentObj]
            });
        } else {
            await classroomModel.updateOne({ _id: classroomId }, {
                student: [studentObj]
            });
        }

        response(res,200, "success", "Create Student done.",null);
    } catch (error){
        console.log(error)
        handleError(res, error);
    }
}

export const updateStudentClassroom = async (req:Request, res:Response) => {
    
    try{
        const {classroomId, studentNo} = req.params;
        
        const { student_firstname, student_lastname, student_no } = req.body;

        await classroomModel.updateOne({ _id: classroomId } ,{
            firstname: student_firstname,
            lastname: student_lastname,
            no: student_no

        } ,  { 
            arrayFilters: [{ "student.no": studentNo }] 
          })
        response(res,200, "success", "Update Student done.",null);

    }catch (error) {
        console.log(error)
        handleError(res, error)
    }
}