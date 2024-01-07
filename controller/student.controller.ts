import { Response, Request } from "express";
import classroomModel from "../schemas/classroom.schema";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";


export const createStudentClassroom = async (req: Request, res: Response) => {
    try {
        const classroomId = req.params.classroom_id;
        
        const { student_firstname, student_lastname, student_no } = req.body;

        const classroom = await classroomModel.findById({ _id:classroomId })

        const studentObj = {
            firstname: student_firstname,
            lastname: student_lastname,
            no: student_no
        };

        if (classroom?.student != undefined) {
            // ADD NEW 🆕 +++++
            // ** CHECK STUDENT NO DUPLICATE
            const studentNoDuplicate = classroom?.student.find((item) => item.no === Number(studentObj.no));

            if (studentNoDuplicate) {
                return response(res, 400, 'fail', 'Student no is duplicate', null);
            }
            // ++++++++

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
        // ไม่สามารถ update no ของนักเรียนได้แล้ว
        const { classroom_id, student_no } = req.params;
        const { firstname, lastname } = req.body;

        // Check no have in classroom yet 
        const classroom = await classroomModel.findById({ _id: classroom_id });

        if (!classroom) {
            return response(res,  404, 'fail', 'Not have this classroom', null);
        }

        if (classroom?.student.length === 0 || !classroom?.student) {
            return response(res, 400, 'fail', 'Classroom not have any student', null);
        }

        const studentNotFounded = classroom.student.find((item) => item.no === Number(student_no));

        if (!studentNotFounded) {
            return response(res, 404, 'fail', 'Not founded student no', null);
        }


        await classroomModel.updateOne({ _id: classroom_id, 'student.no': student_no } ,
            { 
                $set: {
                    'student.$[x].firstname': firstname,
                    'student.$[x].lastname': lastname,
                }
            }, 
            { 
                arrayFilters: [{ 'x.no': student_no }] 
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
        const classroomId = req.params.classroom_id;

        const studentclassroom = await classroomModel.findOne({ _id: classroomId })
        
        response(res,200, "success", "Find Student Classroom",studentclassroom?.student);

    }catch (error) {
        console.log (error)
        handleError(res, error);
    }
}

export const getStudentClassroomById = async (req:Request, res:Response) => {
    
    try {
        const { classroom_id, student_no } = req.params;

        const classroom = await classroomModel.findById({ _id:classroom_id})
        

        if ( classroom == null ) {
            return response(res,404, "fail", "Not Found Classroom",null);
        }
        
        const studentFilter = classroom?.student.filter((student) => student.no === Number(student_no))

        if (studentFilter?.length === 0) {
            return response(res,404, "fail", "Not Found Student",null);
        }
        console.log(studentFilter);
        response(res,200, "success", "Find Student",studentFilter[0]);
        
    }catch (error) {
        console.log(error)
        handleError(res, error);
    }
}

export const deleteStudentClassroomById =async (req:Request, res:Response) => {
    try {
        const { classroom_id, student_no } = req.params;

        const classroom = await classroomModel.findById({ _id:classroom_id})

        if ( classroom == null ) {
            return response(res,404, "fail", "Not have this classroom",null);
        }

        if (classroom?.student.length === 0 || !classroom?.student) {
            return response(res,404, "fail", "classroom  not have any student", null);
        }

        const student = classroom?.student.filter(item => item.no !== Number(student_no)) 
       
        await classroomModel.updateOne({ _id: classroom_id }, {
            student: [...student]
        });

        response(res,200, "success", "Delete Student", null);
    }catch (error) {
        console.log(error)
        handleError(res, error);
    }
}