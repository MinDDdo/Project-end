import { Response, Request } from "express";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import  studentModel  from "../schemas/student.schema";


export const createStudentClassroom = async (req: Request, res: Response) => {
    try {
        const { classroom_id } = req.params;
        
        const { firstname, lastname, no } = req.body;

        const studentAll = await studentModel.find({ classroom_id: classroom_id})

        const studentFind = studentAll.find((item) => {
            if (item.no === no) {
                return item
            }
        })
        if (studentFind) {
            return response(res,422, "fail", "NO is duplicate",null);
        }

        await studentModel.create({
            classroom_id: classroom_id,
            no: no,
            firstname: firstname,
            lastname: lastname
        })

        response(res,200, "success", "Create Student done.",null);
    } catch (error){
        console.log(error)
        handleError(res, error);
    }
}

export const updateStudentClassroom = async (req:Request, res:Response) => {
    try{
        const { student_id } = req.params;
        const { firstname, lastname } = req.body;

        const student = await studentModel.updateOne({ _id: student_id }, {
            firstname: firstname,
            lastname: lastname
        })
        console.log(student)

        response(res,200, "success", "Update Student done.",null);
    }catch (error) {
        console.log(error)
        handleError(res, error)
    }
}

export const getAllStudentClassroom = async (req:Request, res:Response) => {

    try {
        const { classroom_id } = req.params;

        const student = await studentModel.find({ classroom_id: classroom_id })
        
        response(res,200, "success", "Find Student Classroom",student);

    }catch (error) {
        console.log (error)
        handleError(res, error);
    }
}

export const getStudentClassroomById = async (req:Request, res:Response) => {
    
    try {
        const { student_id } = req.params;

        const student = await studentModel.findById({ _id:student_id})

        if (!student) {
            return response(res,404, "fail", "Not found",null);
        }
        
        response(res,200, "success", "Find Student",student);
        
    }catch (error) {
        console.log(error)
        handleError(res, error);
    }
}

export const deleteStudentClassroomById = async (req:Request, res:Response) => {
    try {
        const { student_id } = req.params;

        await studentModel.deleteOne({ _id: student_id })

        response(res,200, "success", "Delete Student", null);
    }catch (error) {
        console.log(error)
        handleError(res, error);
    }
}