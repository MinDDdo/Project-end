import { Response, Request } from "express";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import excelJS from 'exceljs';
import fs from 'fs';
import studentModel from "../schemas/student.schema";
import assignmentModel from "../schemas/assignment.schema";
import attendanceModel from "../schemas/attendance.schema";


export const createStudent = async (req: Request, res: Response) => {
    try {
        const { classroom_id } = req.params;
        
        const { firstname, lastname, no, image } = req.body;

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
            lastname: lastname,
            image: image
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
        const { firstname, lastname, image } = req.body;

        await studentModel.updateOne({ _id: student_id }, {
            firstname: firstname,
            lastname: lastname,
            image: image
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
                    _id: 0,
                    image: 1
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

        console.log(req.body)

        const student = await studentModel.findById({ _id:student_id})

        if (!student) {
            return response(res,404, "fail", "Not found",null);
        }
        const studentObj = {
            id: student._id,
            classroom_id: student.classroom_id,
            no: student.no,
            firstname: student.firstname,
            lastname: student.lastname,
            image: student.image
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

export const randomGroup = async (req: Request, res: Response) => {
    try {
        const { classroom_id } = req.params;
        const { group_size } = req.body;

        const students = await studentModel.find({ classroom_id: classroom_id });

        if (students.length === 0) {
            return response(res, 404, 'fail', "Don't have student", null);
        }

        for (let i = students.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [students[i], students[j]] = [students[j], students[i]];
        }
        
        const groupSize = group_size; // Set the desired group size
        
        const groupResponse: any = [];
        for (let i = 0; i < students.length; i += groupSize) {
            const group = students.slice(i, i + groupSize).map(item => {
                const obj = {
                    firstname: item.firstname,
                    lastname: item.lastname,
                    no: item.no,
                }

                return obj;
            });

            groupResponse.push(group);
        }

        response(res, 200, 'success', 'Group student success', groupResponse);
          
    } catch (error) {
        handleError(res, error);
    }
}

export const uploadStudentList = async (req: Request, res: Response) => {
    try {
        const { classroom_id } = req.params;

        if (req.file?.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            fs.unlink(req.file?.path || '', err => {
                if (err) {
                    console.error('[DELETE FILE]: Error deleting file:', err);
                } else {
                    console.log('[DELETE FILE]: File deleted successfully');
                }
            });

            return response(res, 422, 'fail', 'File is not .xlsx format', null);
        }

        const workbook = new excelJS.Workbook();
        await workbook.xlsx.readFile(req.file?.path || '');
        const worksheet = workbook.getWorksheet(1); // Assuming first worksheet

        const arrStudentData: any[] = [];

        worksheet?.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber !== 1) {
                const arr: any[] = [];

                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    arr.push(cell.value);
                });

                arrStudentData.push(arr);
            }
        });

        const studentInsertData = arrStudentData.map((item) => {
            const studentObj = {
                classroom_id: classroom_id,
                no: item[0],
                firstname: item[1],
                lastname: item[2],
                image: "S_1"
            };
            
            return studentObj;
        })

        arrStudentData.forEach(async(item) => {
            const studentObj = {
                classroom_id: classroom_id,
                no: item[0],
                firstname: item[1],
                lastname: item[2],
                image: "S_1"
            };

            const newStudent = {
                no: item[0],
                firstname: item[1],
                lastname: item[2],
                handin: false
            }

            await assignmentModel.updateMany({ classroom_id: classroom_id }, {
                $push: {
                    student: newStudent
                }
            });
    
            const newAttendance = {
                no: item[0],
                firstname: item[1],
                lastname: item[2],
                present: false
            }

            await attendanceModel.updateMany({ classroom_id: classroom_id }, {
                $push: {
                    student: newAttendance
                }
            });
        })

        if (studentInsertData.length === 0) {
            return response(res, 404, 'fail', "Don't have any data for upload", null);
        }

        console.log(studentInsertData);

        await studentModel.insertMany(studentInsertData);

        fs.unlink(req.file.path, err => {
            if (err) {
                console.error('[DELETE FILE]: Error deleting file:', err);
            } else {
                console.log('[DELETE FILE]: File deleted successfully');
            }
        });

        response(res, 200, 'success', 'Upload student with file done', null);
    } catch (error) {
        console.log(error);
        handleError(res, error);
    }
}