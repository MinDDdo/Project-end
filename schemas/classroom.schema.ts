import mongoose, {Schema, model,ObjectId} from 'mongoose';

interface Student {
    firstname: string,
    lastname: string,
    no: number
}

interface Check {
    no: number,
    check: boolean,
    check_time: Date,
}

interface Assignment {
    name: string,
    detail: string,
    checks: Check[],
    assign_date: Date,
    _id: string
}

interface Attendance {
    date: Date,
    student: Check[]
}
interface Classroom {
    classroom_name: string,
    code: string,
    owner: string,
    student: Student[],
    assigment: Assignment[],
    attendance: Attendance[]
}
const studentSchema = new Schema<Student>({
    firstname: String,
    lastname: String,
    no: {
        type: Number,
        unique: true
    }
});

const checkSchema = new Schema<Check>({
    no: Number,
    check: String,
    check_time: Date,
})

const assigmentSchema = new Schema<Assignment>({
    name: String,
    detail: String,
    _id: Schema.ObjectId,
    checks: [checkSchema]
})
 
const attendanceSchema = new Schema<Attendance>({
    date: Date,
    student: [checkSchema]
})

const classroomSchema = new Schema<Classroom>({
    classroom_name: {
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
    student: {
        type: [studentSchema],
        default: undefined
    },
    assigment: {
        type: [assigmentSchema],
        default: undefined
    },
    attendance: {
        type: [attendanceSchema],
        default: undefined
    }
})

const classroomModel = model('classroom', classroomSchema);

export default classroomModel;