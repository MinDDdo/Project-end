import { Router } from "express";
import validToken from '../middlewares/authenJWT';
import { createAttendance, updateAttendance, 
        deleteAttendance, getAllAttendance, 
        getAttendanceById, exportAttendanceExcel, 
        studentCheckStatusAttendance } from "../controller/attendance.controller";

const router = Router();

router.post('/create-attendance',validToken, createAttendance);
router.put('/:attendance_id/update-attendance',validToken, updateAttendance);
router.delete('/:attendance_id/delete-attendance',validToken, deleteAttendance);
router.get('/:classroom_id/getAll-attendance',validToken, getAllAttendance);
router.get('/:attendance_id/getById-attendance',validToken, getAttendanceById);
router.post('/check-attendance',validToken, studentCheckStatusAttendance);

router.get('/export-attendance-excel',validToken, exportAttendanceExcel);

export default router;