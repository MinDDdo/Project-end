import { Router } from "express";
import { createStudentClassroom, updateStudentClassroom, 
    getAllStudentClassroom, getStudentClassroomById, deleteStudentClassroomById } from "../controller/student.controller";

const router = Router();

router.post('/:classroom_id/create-student', createStudentClassroom);
router.put('/update-student/:student_id', updateStudentClassroom);
router.get('/:classroom_id/getAll-student', getAllStudentClassroom);
router.get('/:classroom_id/getById-student/:student_id', getStudentClassroomById);
router.delete('/:classroom_id/deleteById-student/:student_id', deleteStudentClassroomById);

export default router;