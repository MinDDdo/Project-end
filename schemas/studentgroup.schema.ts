import mongoose, { Schema, model } from 'mongoose';

interface Group {
    firstname: string;
    lastname: string;
    no: number;
}

interface StudentGroup {
    classroom_id: string;
    group_name: string;
    group_size: number;
    data: Group[]
}

const groupSchema = new Schema<Group>({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    no: {
        type: Number
    }
}, { _id: false });

const studentGroupSchema = new Schema<StudentGroup>({
    classroom_id: {
        type: String,
        required: true
    },
    group_name: {
        type: String,
        required: true
    },
    group_size: {
        type: Number
    },
    data: {
        type: [[groupSchema]],
        default: undefined
    }
})

const studentGroupModel = model('studentGroup', studentGroupSchema);

export default studentGroupModel;