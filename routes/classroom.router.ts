import { Router } from "express";
import { createClassroom, getAllClassroom, getClassroomById, updateClassroomById, deleteClassroomById  } from "../controller/classroom.controller";
import { createStudentClassroom } from "../controller/student.controller";

const router = Router();

router.post('/create', createClassroom);
router.get('/getAll/:teacher_id', getAllClassroom);
router.get('/getById/:classroom_id', getClassroomById);
router.put('/updateById/:classroom_id', updateClassroomById);
router.delete('/deleteById/:classroom_id', deleteClassroomById);

router.post('/:classroom_id/create-student', createStudentClassroom);
router.put('/:classroom_id/update-student/:student_no', updateClassroomById)


export default router;