import { Router } from "express";
import { createClassroom, updateClassroomById, getAllClassroom,  getClassroomById, deleteClassroomById } from "../controller/classroom.controller";
import { createStudentClassroom, updateStudentClassroom, 
    getAllStudentClassroom, getStudentClassroomById, deleteStudentClassroomById } from "../controller/student.controller";
import { createAssignment } from "../controller/assignment.controller"

const router = Router();

router.post('/create', createClassroom);
router.get('/getAll/:teacher_id', getAllClassroom);
router.get('/getById/:classroom_id', getClassroomById);
router.put('/updateById/:classroom_id', updateClassroomById);
 router.delete('/deleteById/:classroom_id', deleteClassroomById);

router.post('/:classroom_id/create-student', createStudentClassroom);
router.put('/update-student/:student_id', updateStudentClassroom);
router.get('/:classroom_id/getAll-student', getAllStudentClassroom);
router.get('/:classroom_id/getById-student/:student_id', getStudentClassroomById);
router.delete('/:classroom_id/deleteById-student/:student_id', deleteStudentClassroomById);

router.post('/:classroom_id/create-assignment', createAssignment);
// router.get('/:classroom_id/getAll-assignment', getAllAssignment);
// router.get('/:classroom_id/getById-assignment/:assignment_id', getAssignmentById);
// router.put('/:classroom_id/update-assignment/:assignment_id', updateAssignmentById);


export default router;