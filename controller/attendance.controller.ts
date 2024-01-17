import { Response, Request } from "express";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import attendance from "../schemas/attendance.schema";
import attendanceModel from "../schemas/attendance.schema";

export const createStudentAttendance = async (req:Request, res:Response) => {
    try {

        const { attendance_date, student, classroom_id } = req.body;

        const attendance = await attendanceModel.create({ 
            classroom_id: classroom_id ,
            attendance_date: attendance_date,
            student: student
        })
        response(res,200, "success", "Create attendance done",null);
    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}

export const updateStudentAttendance = async (req:Request, res:Response) => {
    try {
        const { attendance_id } = req.params;

        const { student } = req.body;

        await attendanceModel.updateOne({ 
            student: student
        })
        response(res,200, "success", "Update attendance done",null);

    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}

export const deleteStudentAttendance = async (req:Request, res:Response) => {
    try {
        const { attendance_id } = req.params;

        await attendanceModel.deleteOne({ _id: attendance_id })

        response(res,200, "success", "Delete attendance done",null);

    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}

export const getAllStudentAttendance = async (req:Request, res:Response) => {
    try {
        const { classroom_id } = req.params;

        const attendance = await attendanceModel.find({ classroom_id: classroom_id})

        const attendanceMap = attendance.map((item) => {
            const attendanceObj = {
                id: item._id,
                classroom_id: item.classroom_id,
                date: item.attendance_date,
                student: item.student
            }
            return attendanceObj
        })

        response(res,200, "success", "Find done", attendanceMap);

    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}

export const getStudentAttendanceById = async (req:Request, res:Response) => {
    try {
        const { attendance_id } = req.params;

        const attendance = await attendanceModel.findById({ _id: attendance_id });

        const attendanceObj = {
            id: attendance?._id,
            classroom_id: attendance?.classroom_id,
            date: attendance?.attendance_date,
            student: attendance?.student
        }
        response(res,200, "success", "Find done", attendanceObj);

    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}