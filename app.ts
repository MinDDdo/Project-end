import express from 'express';
import bodyParser from 'body-parser';
import { connectMongoDB } from './database/mongodb';
import cors from 'cors';
import multer from 'multer';

import teacherRoute from './routes/teacher.router'
import classroomRoute from './routes/classroom.router';
import authenRoute from './routes/authen.router';
import studentRoute from './routes/student.router';
import assignmentRoute from './routes/assignment.router';
import attendanceRoute from './routes/attendance.router';


const app = express();

app.use(cors({
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use(bodyParser.json());

app.use('/v1/attendance', attendanceRoute);
app.use('/v1/teacher', teacherRoute);
app.use('/v1/classroom', classroomRoute);
app.use('/v1/auth', authenRoute);
app.use('/v1/student', studentRoute);
app.use('/v1/assignment', assignmentRoute);


connectMongoDB().then();


app.listen(8080 , () => {
    console.log('http://localhost:8080')
})