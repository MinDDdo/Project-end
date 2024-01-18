import { Response, Request } from "express";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import  studentModel  from "../schemas/student.schema";
import assignmentModel from "../schemas/assignment.schema";
import attendanceModel from "../schemas/attendance.schema";


export const createStudentClassroom = async (req: Request, res: Response) => {
    try {
        const { classroom_id } = req.params;
        
        const { firstname, lastname, no } = req.body;

        const studentAll = await studentModel.find({ classroom_id: classroom_id})

        const studentFind = studentAll.find((item) => {
            if (item.no === no) {
                return item
            }
        });

        if (studentFind) {
            return response(res,422, "fail", "NO is duplicate",null);
        }

        await studentModel.create({
            classroom_id: classroom_id,
            no: no,
            firstname: firstname,
            lastname: lastname
        });

        const newStudent = {
            no: no,
            firstname: firstname,
            lastname: lastname,
            handin: false
        }
        await assignmentModel.updateMany({ classroom_id: classroom_id }, {
            $push: {
                student: newStudent
            }
        });

        const newAttendance = {
           no: no,
           firstname: firstname,
           lastname: lastname,
           present: false
        }
        await attendanceModel.updateMany({ classroom_id: classroom_id }, {
            $push: {
                student: newAttendance
            }
        });

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

        await studentModel.updateOne({ _id: student_id }, {
            firstname: firstname,
            lastname: lastname
        })

        const student = await studentModel.findById({ _id: student_id })

        if (!student) {
            return response(res,404, "fail", "Not Found", null);
        }

        await assignmentModel.updateMany({ classroom_id: student.classroom_id , 'student.no': student.no }, 
            {
                $set: {
                    'student.$[x].firstname': firstname,
                    'student.$[x].lastname': lastname
                }
            },
            {
                arrayFilters: [{ 'x.no': student.no }]
            }
        );
        await attendanceModel.updateMany({ classroom_id: student.classroom_id , 'student.no': student.no }, 
            {
                $set: {
                    'student.$[x].firstname': firstname,
                    'student.$[x].lastname': lastname
                }
            },
            {
                arrayFilters: [{ 'x.no': student.no }]
            }
        );
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

        const studentMap = student.map((item) => {
            const studentObj = {
                id: item.id,
                classroom_id: item.classroom_id,
                no: item.no,
                firstname: item.firstname,
                lastname: item.lastname 
            }
            return studentObj;
        }) 
        response(res,200, "success", "Find Student Classroom",studentMap);

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
        
        const student = await studentModel.findById({ _id: student_id })

        if (!student) {
            return response(res,404, "fail", "Not found", null)
        }

        await studentModel.deleteOne({ _id: student_id })

        await assignmentModel.updateMany({ classroom_id: student.classroom_id }, 
            {
                $pull: {
                    student: { no: student.no }
                }
            }
        )
        await attendanceModel.updateMany({ classroom_id: student.classroom_id }, 
            {
                $pull: {
                    student: { no: student.no }
                }
            }
        )
        response(res,200, "success", "Delete Student", null);
    }catch (error) {
        console.log(error)
        handleError(res, error);
    }
}