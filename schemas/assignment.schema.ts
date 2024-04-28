import mongoose, { Schema, model } from 'mongoose';

interface Assignment {
    classroom_id: string;
    student: StudentItem[];
    assign_create: Date;
    assign_due: Date;
    assign_name: string;
    assign_detail: string;
    assign_score: boolean;
    max_score: number;
}

interface StudentItem {
    no: number;
    firstname: string;
    lastname: string;
    handin: boolean;
    score: number;
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
    handin: {
        type: Boolean,
        required: true,
    },
    score: {
        type: Number,
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
    assign_name: {
        type: String,
        required: true
    },
    assign_detail: {
        type: String,
        required: true
    },
    student: {
        type: [studentItemSchema],
        default: undefined
    },
    assign_score: {
        type: Boolean,
    },
    max_score: {
        type: Number
    }
})

const assignmentModel = model('assigment', assignmentSchema);

export default assignmentModel;