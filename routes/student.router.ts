import { Router } from "express";
import validToken from '../middlewares/authenJWT';
import { 
    createStudent, 
    updateStudent, 
    getAllStudent, 
    getStudentById, 
    deleteStudentById,
    randomGroup
} from "../controller/student.controller";

const router = Router();

router.post('/:classroom_id/create-student', validToken, createStudent);
router.put('/update-student/:student_id', validToken,updateStudent);
router.get('/:classroom_id/getAll-student',validToken, getAllStudent);
router.get('/:classroom_id/getById-student/:student_id',validToken, getStudentById);
router.delete('/deleteById-student/:student_id', validToken,deleteStudentById);
router.post('/:classroom_id/group-student', validToken, randomGroup);

export default router;