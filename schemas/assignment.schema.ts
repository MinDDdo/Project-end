import mongoose, { Schema, model } from 'mongoose';

interface Assignment {
    classroom_id: string;
    student: StudentItem[];
    assign_create: Date;
    assign_due: Date;
}

interface StudentItem {
    no: number;
    handin: boolean;
}

const studentItemSchema = new Schema<StudentItem>({
    no: { 
        type: Number, 
        required: true,
        unique: true
    },
    handin: {
        type: Boolean,
        required: true,
    }
}, { _id: false })

const assignmentSchema = new Schema<Assignment>({
    classroom_id: { 
        type: String, 
        required: true 
    },
    assign_create: {
        type: Date,
        required: true
    },
    assign_due: {
        type: Date,
        required: true
    },
    student: {
        type: [studentItemSchema],
        default: undefined
    },
})

const assignmentModel = model('assigment', assignmentSchema);

export default assignmentModel;