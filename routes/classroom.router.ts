import { Router } from "express";
import validToken from "../middlewares/authenJWT";
import { createClassroom, updateClassroomById, 
    getAllClassroom,  getClassroomById, 
    deleteClassroomById } from "../controller/classroom.controller";

const router = Router();

router.post('/create', validToken, createClassroom);
router.get('/getAll/:teacher_id', validToken, getAllClassroom);
router.get('/getById/:classroom_id', validToken, getClassroomById);
router.put('/updateById/:classroom_id', validToken, updateClassroomById);
router.delete('/deleteById/:classroom_id', validToken, deleteClassroomById);

export default router;