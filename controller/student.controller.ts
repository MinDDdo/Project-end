import { Response, Request } from "express";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import  studentModel  from "../schemas/student.schema";
import assignmentModel from "../schemas/assignment.schema";
import attendanceModel from "../schemas/attendance.schema";


export const createStudent = async (req: Request, res: Response) => {
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

export const updateStudent= async (req:Request, res:Response) => {
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

export const getAllStudent = async (req:Request, res:Response) => {

    try {
        const { classroom_id } = req.params;

        const student = await studentModel.aggregate([
            {
                $match: { classroom_id: classroom_id }
            },
            {
                $project: {
                    id: "$_id",
                    classroom_id: 1,
                    no: 1,
                    firstname: 1,
                    lastname: 1,
                    _id: 0
                }
            }
        ])

        response(res,200, "success", "Find Student Classroom",student);

    }catch (error) {
        console.log (error)
        handleError(res, error);
    }
}

export const getStudentById = async (req:Request, res:Response) => {
    
    try {
        const { student_id } = req.params;

        const student = await studentModel.findById({ _id:student_id})

        if (!student) {
            return response(res,404, "fail", "Not found",null);
        }
        const studentObj = {
            id: student._id,
            classroom_id: student.classroom_id,
            no: student.no,
            firstname: student.firstname,
            lastname: student.lastname
        }
        
        response(res,200, "success", "Find Student",studentObj);
        
    }catch (error) {
        console.log(error)
        handleError(res, error);
    }
}

export const deleteStudentById = async (req:Request, res:Response) => {
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

