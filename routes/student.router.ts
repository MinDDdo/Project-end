import { Router } from "express";
import validToken from '../middlewares/authenJWT';
import multer from 'multer';
import { 
    createStudent, 
    updateStudent, 
    getAllStudent, 
    getStudentById, 
    deleteStudentById,
    createGroup,
    uploadStudentList,
    getAllGroup,
    deleteGroupById,
    getGroupById
} from "../controller/student.controller";
import bodyParser from "body-parser";

const router = Router();

const upload = multer({ dest: 'uploads/' });

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/:classroom_id/create-student', validToken, createStudent);
router.put('/update-student/:student_id', validToken,updateStudent);
router.get('/:classroom_id/getAll-student',validToken, getAllStudent);
router.get('/:classroom_id/getById-student/:student_id',validToken, getStudentById);
router.delete('/deleteById-student/:student_id', validToken,deleteStudentById);
// router.post('/:classroom_id/group-student', validToken, randomGroup);
router.post('/:classroom_id/create-group-student', createGroup);
router.get('/:classroom_id/group-student', getAllGroup);
router.get('/:classroom_id/group-student/:group_id', getGroupById);
router.delete('/delete-group-student/:group_id', deleteGroupById);

router.post('/:classroom_id/upload-student', validToken, upload.single('file'), uploadStudentList);

export default router;