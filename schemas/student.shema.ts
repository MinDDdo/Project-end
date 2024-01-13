import mongoose, { Schema, model } from 'mongoose';

interface Student {
    classroom_id: string;
    student: StudentItem[]
}

interface StudentItem {
    no: number;
    firstname: string;
    lastname: string;
}

const studentItemSchema = new Schema<StudentItem>({
    no: { 
        type: Number, 
        required: true,
        unique: true
    },
    firstname: { 
        type: String, 
        required: true 
    },
    lastname: { 
        type: String, 
        required: true 
    },
}, { _id: false })

const studentSchema = new Schema<Student>({
    classroom_id: { 
        type: String, 
        required: true 
    },
    student: {
        type: [studentItemSchema],
        default: undefined
    },
})

const studentModel = model('student', studentSchema);

export default studentModel;