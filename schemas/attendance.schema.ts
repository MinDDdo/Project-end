import mongoose, { Schema, model } from 'mongoose';

interface Attendance {
    classroom_id: string;
    attendance_date: Date;
    student: StudentItem[];
}

interface StudentItem {
    no: number;
    firstname: string;
    lastname: string;
    status: string;
}

const studentItemSchema = new Schema<StudentItem>({
    no: { 
        type: Number, 
        required: true
        
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { _id: false })

const attendanceSchema = new Schema<Attendance>({
    classroom_id: { 
        type: String, 
        required: true 
    },
    attendance_date: {
        type: Date,
        required: true
    },
    student: {
        type: [studentItemSchema],
        default: undefined
    },
})

const attendanceModel = model('attendance', attendanceSchema);

export default attendanceModel;