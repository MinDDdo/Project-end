import mongoose, { Schema, model } from 'mongoose';

interface Student {
    classroom_id: string;
    no: number;
    firstname: string;
    lastname: string;
}

const studentSchema = new Schema<Student>({
    classroom_id: { 
        type: String, 
        required: true 
    },
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
    }
})

const studentModel = model('student', studentSchema);

export default studentModel;