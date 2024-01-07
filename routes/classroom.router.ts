import { Router } from "express";
import { createClassroom, getAllClassroom, getClassroomById, updateClassroomById, deleteClassroomById  } from "../controller/classroom.controller";
import { createStudentClassroom, updateStudentClassroom, 
        getAllStudentClassroom, getStudentClassroomById, 
        deleteStudentClassroomById } from "../controller/student.controller";
import { createAssignment, getAllAssignment, getAssignmentById, updateAssignmentById } from "../controller/assignment.controller"

const router = Router();

router.post('/create', createClassroom);
router.get('/getAll/:teacher_id', getAllClassroom);
router.get('/getById/:classroom_id', getClassroomById);
router.put('/updateById/:classroom_id', updateClassroomById);
router.delete('/deleteById/:classroom_id', deleteClassroomById);

router.post('/:classroom_id/create-student', createStudentClassroom);
router.put('/:classroom_id/update-student/:student_no', updateStudentClassroom);
router.get('/:classroom_id/getAll-student', getAllStudentClassroom);
router.get('/:classroom_id/getById-student/:student_no', getStudentClassroomById);
router.delete('/:classroom_id/deleteById-student/:student_no', deleteStudentClassroomById);

router.post('/:classroom_id/create-assignment', createAssignment);
router.get('/:classroom_id/getAll-assignment', getAllAssignment);
router.get('/:classroom_id/getById-assignment/:assignment_id', getAssignmentById);
router.put('/:classroom_id/update-assignment/:assignment_id', updateAssignmentById);


export default router;