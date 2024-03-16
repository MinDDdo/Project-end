import { Response, Request } from "express";
import classroomModel from "../schemas/classroom.schema";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import studentModel from "../schemas/student.schema";
import assignmentModel from "../schemas/assignment.schema";
import { log } from "console";


export const createAssignment = async (req: Request, res: Response) => {

    try {
        const { classroom_id } = req.params;

        const { assign_name, assign_detail, assign_due } = req.body;

        const student = await studentModel.find({ classroom_id: classroom_id });

        const studentMap = student.map((item) => {
            const studentObj = {
                no: item.no,
                firstname: item.firstname,
                lastname: item.lastname,
                handin: false
            }
            return studentObj
        })

        await assignmentModel.create({
            classroom_id: classroom_id,
            assign_create: new Date(),
            assign_due: assign_due,
            assign_name: assign_name,
            assign_detail: assign_detail,
            student: studentMap
        })

        response(res, 200, "success", "Create Assignment done", null);

    } catch (error) {
        console.log(error)
        handleError(res, error);
    }
}

export const getAllAssignment = async (req: Request, res: Response) => {

    try {
        const { classroom_id } = req.params;

        const assigment = await assignmentModel.find({ classroom_id: classroom_id })

        const assigmentMap = assigment.map((item) => {
            const assigmentObj = {
                id: item._id,
                classroom_id: item.classroom_id,
                assign_create: item.assign_create,
                assign_due: item.assign_due,
                assign_name: item.assign_name,
                assign_detail: item.assign_detail,
                student: item.student
            }
            return assigmentObj;
        })

        response(res, 200, "success", "Find assignment done", assigmentMap);
    } catch (error) {
        console.log(error);
        handleError(res, error);
    }
}

export const getAssignmentById = async (req: Request, res: Response) => {
    try {
        const { assignment_id } = req.params;

        const assignment = await assignmentModel.findById({ _id: assignment_id });
        console.log(assignment)

        const assignmentObj = {
            id: assignment?._id,
            classroom_id: assignment?.classroom_id,
            assign_create: assignment?.assign_create,
            assign_due: assignment?.assign_due,
            assign_name: assignment?.assign_name,
            assign_detail: assignment?.assign_detail,
            student: assignment?.student
        };

        response(res, 200, "success", "Find assignment done", assignmentObj);

    } catch (error) {
        console.log(error);
        handleError(res, error);
    }
}

export const updateAssignmentById = async (req: Request, res: Response) => {
    try {
        const { assignment_id } = req.params;
        const { assign_name, assign_detail, assign_due } = req.body;

        await assignmentModel.updateOne({ _id: assignment_id }, {
            assign_name: assign_name,
            assign_detail: assign_detail,
            assign_due: assign_due
        });

        response(res, 200, "success", "Update assignment done", null);
    } catch (error) {
        console.log(error);
        handleError(res, error);
    }
}

export const deleteAssignmentById = async (req: Request, res: Response) => {
    try {
        const { assignment_id } = req.params;

        await assignmentModel.deleteOne({ _id: assignment_id });

        response(res, 200, "success", "Delete assignmet done", null);
    } catch (error) {
        console.log(error);
        handleError(res, error);
    }
}

export const checkAssignment = async (req: Request, res: Response) => {
    try {
        const { assignment_id } = req.params;

        const { no, checked } = req.body;

        await assignmentModel.updateOne({ _id: assignment_id, 'student.no': no },
            {
                $set: {
                    'student.$[x].handin': checked
                }
            },
            {
                arrayFilters: [{ 'x.no': no}]
            }
        );
        response(res,200, "success", "Check assignment done",null)

    } catch (error) {
        console.log(error);
        handleError(res, error);

    }
}

export const studentCheckStatusAssignment = async (req:Request, res:Response) => {
    try {
        const { no , classroom_id } = req.body;
        
        const assigment = await assignmentModel.aggregate([
            { $unwind: "$student" },
            {
                $match: { classroom_id: classroom_id, "student.no": no },
            },

            {
              $project: {
                _id: 0,
                assign_id: "$_id",
                classroom_id: 1,
                assign_name: 1,
                assign_detail: 1,
                handin_detail: "$student",
                assign_create: 1,
                assign_due: 1
              }
            }
          ])
        console.log(assigment)
        response(res,200, "success", "Check done", assigment)

    }catch (error) {
        console.log(error);
        handleError(res,error);
    }
}