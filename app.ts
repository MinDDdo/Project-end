import express from 'express';
import bodyParser from 'body-parser';
import { connectMongoDB } from './database/mongodb';

import teacherRoute from './routes/teacher.router'
import classroomRoute from './routes/classroom.router';


const app = express();

app.use(bodyParser.json())

app.use('/v1/teacher', teacherRoute);
app.use('/v1/classroom', classroomRoute);


connectMongoDB().then();


app.listen(8080 , () => {
    console.log('http://localhost:8080')
})