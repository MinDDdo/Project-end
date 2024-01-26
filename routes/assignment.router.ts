import { Router } from "express";
import validToken from '../middlewares/authenJWT';
import { createAssignment, getAllAssignment, getAssignmentById, 
        updateAssignmentById, deleteAssignmentById, 
        checkAssignment, studentCheckStatusAssignment,  } from "../controller/assignment.controller"

const router = Router();

router.post('/:classroom_id/create-assignment',validToken, createAssignment);
router.get('/:classroom_id/getAll-assignment',validToken, getAllAssignment);
router.get('/getById-assignment/:assignment_id',validToken, getAssignmentById);
router.put('/update-assignment/:assignment_id',validToken, updateAssignmentById);
router.delete('/delete-assignment/:assignment_id',validToken, deleteAssignmentById);
router.post('/check-assignment/:assignment_id',validToken, checkAssignment);
router.post('/check-handin',validToken, studentCheckStatusAssignment);


export default router;