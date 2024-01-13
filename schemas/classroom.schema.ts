import mongoose, {Schema, model,ObjectId} from 'mongoose';

interface Classroom {
    name: string;
    code: string;
    owner: string;
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
    }
})

const classroomModel = model('classroom', classroomSchema);

export default classroomModel;