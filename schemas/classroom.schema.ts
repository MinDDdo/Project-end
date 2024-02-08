import mongoose, {Schema, model,ObjectId} from 'mongoose';

interface Classroom {
    name: string;
    code: string;
    owner: string;
    subject_code: string;
    grade: string;
    image: string;
}

const classroomSchema = new Schema<Classroom>({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: String,
        required: true
    },
    subject_code: {
        type: String
    },
    grade: {
        type: String
    },
    image: {
        type: String
    }

})

const classroomModel = model('classroom', classroomSchema);

export default classroomModel;