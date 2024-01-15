import { Router } from "express";
import { createClassroom, updateClassroomById, getAllClassroom,  getClassroomById, deleteClassroomById } from "../controller/classroom.controller";

const router = Router();

router.post('/create', createClassroom);
router.get('/getAll/:teacher_id', getAllClassroom);
router.get('/getById/:classroom_id', getClassroomById);
router.put('/updateById/:classroom_id', updateClassroomById);
router.delete('/deleteById/:classroom_id', deleteClassroomById);

export default router;