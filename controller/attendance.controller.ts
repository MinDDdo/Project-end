import { Response, Request } from "express";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import attendanceModel from "../schemas/attendance.schema";
import excelJS from 'exceljs';
import dayjs from 'dayjs';

export const createAttendance = async (req:Request, res:Response) => {
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

export const updateAttendance = async (req:Request, res:Response) => {
    try {
        const { attendance_id } = req.params;

        const { student } = req.body;

        await attendanceModel.updateOne({ _id: attendance_id},{ 
            student: student
        })
        response(res,200, "success", "Update attendance done",null);

    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}

export const deleteAttendance = async (req:Request, res:Response) => {
    try {
        const { attendance_id } = req.params;

        await attendanceModel.deleteOne({ _id: attendance_id })

        response(res,200, "success", "Delete attendance done",null);

    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}

export const getAllAttendance = async (req:Request, res:Response) => {
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

export const getAttendanceById = async (req:Request, res:Response) => {
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

export const exportAttendanceExcel = async (req: Request, res: Response) => {
    try {
        const { classroom_id } = req.body;
        const { start_date, end_date } = req.query;

        const attendanceData = await attendanceModel.find(
            { 
                classroom_id: classroom_id,  
                attendance_date: {
                    $gte: start_date,
                    $lte: end_date
                }
            }
        );

        const workbook = new excelJS.Workbook();

        attendanceData.forEach((attendance) => {
            const dateFormat = dayjs(attendance.attendance_date).format('YYYY-MM-DD');

            const worksheet = workbook.addWorksheet(dateFormat);

            worksheet.columns = [
                { header: 'no', key: 'no', width: 10 },
                { header: 'firstname', key: 'fname', width: 30 },
                { header: 'latstname', key: 'lname', width: 30 },
                { header: 'date', key: 'date', width: 10 },
                { header: 'status', key: 'status', width: 10 }
            ]
    
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            attendance.student.forEach((student) => {    
                worksheet.addRow({
                    no: student.no,
                    date: dateFormat,
                    fname: student.firstname,
                    lname: student.lastname,
                    status: student.status
                })
            })
        })

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

        // await workbook.xlsx.write(res);
        res.end(buffer);
    } catch (error) {
        handleError(res, error);
    }
}