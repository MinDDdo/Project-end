import {Schema, model} from 'mongoose';

interface Teacher {
    firstname: string;
    lastname: string;
    dob: Date;
    gender: string;
    email: string;
    password: string;
    line_contact: string;
    phone_contact: string;
    refresh_token: string;
}

const teacherSchema = new Schema <Teacher>({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
    },
    email: {
        type: String,
        reqiured: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    line_contact: {
        type: String
    },
    phone_contact: {
        type: String
    },
    refresh_token: {
        type: String
    }
})

const teacherModel = model('teacher', teacherSchema);

export default teacherModel;