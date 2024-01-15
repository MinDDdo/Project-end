import { Router } from "express";
import { createAssignment, getAllAssignment, getAssignmentById, 
        updateAssignmentById, deleteAssignmentById, checkAssignment } from "../controller/assignment.controller"

const router = Router();

router.post('/:classroom_id/create-assignment', createAssignment);
router.get('/:classroom_id/getAll-assignment', getAllAssignment);
router.get('/getById-assignment/:assignment_id', getAssignmentById);
router.put('/update-assignment/:assignment_id', updateAssignmentById);
router.delete('/delete-assignment/:assignment_id', deleteAssignmentById);
router.post('/check-assignment/:assignment_id', checkAssignment);


export default router;