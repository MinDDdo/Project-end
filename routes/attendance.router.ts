import { Router } from "express";
import { createStudentAttendance, updateStudentAttendance, 
        deleteStudentAttendance, getAllStudentAttendance, getStudentAttendanceById } from "../controller/attendance.controller";

const router = Router();

router.post('/create-attendance', createStudentAttendance);
router.put('/:attendance_id/update-attendance', updateStudentAttendance);
router.delete('/:attendance_id/delete-attendance', deleteStudentAttendance);
router.get('/:classroom_id/getAll-attendance', getAllStudentAttendance);
router.get('/:attendance_id/getById-attendance', getStudentAttendanceById);

export default router;