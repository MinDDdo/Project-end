import { Response, Request } from "express";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import attendanceModel from "../schemas/attendance.schema";
import excelJS from 'exceljs';
import dayjs from 'dayjs';
import { log } from "console";

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

        const { student, attendance_date } = req.body;

        await attendanceModel.updateOne({ _id: attendance_id},{ 
            student: student,
            attendance_date: attendance_date
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

        console.log(attendanceData)

        if (attendanceData.length === 0) {
            return response(res, 404, 'fail', 'Not founded attendance', null);
        }

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
        res.setHeader('Content-Disposition', `attachment; filename=${Math.round(Math.random())}.xlsx`);

        // await workbook.xlsx.write(res);
        res.end(buffer);
    } catch (error) {
        handleError(res, error);
    }
}

export const studentCheckStatusAttendance = async (req: Request, res: Response) => {
    try {
        const { no , classroom_id } = req.body;
        
        const attendance: {
            attendance_detail: {
              no: number;
              firstname: string;
              lastname: string;
              status: string;
            }
        }[] = await attendanceModel.aggregate([
            { $unwind: "$student" },

            {
                $match: { classroom_id: classroom_id, "student.no": no },
            },

            {
              $project: {
                _id: 0,
                attendance_id: "$_id",
                attendance_detail: "$student",
              }
            }
        ]);

        const attendanceSummary = {
            present: 0,
            absent: 0,
            leave: 0,
            late: 0
        }

        attendance.forEach(item => {
            if (item.attendance_detail.status === "present") {
                attendanceSummary.present += 1
            }

            if (item.attendance_detail.status === "absent") {
                attendanceSummary.absent += 1
            }

            if (item.attendance_detail.status === "leave") {
                attendanceSummary.leave += 1
            }

            if (item.attendance_detail.status === "late") {
                attendanceSummary.late += 1
            }
        })

        response(res,200, "success", "Check done", attendanceSummary);

    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}