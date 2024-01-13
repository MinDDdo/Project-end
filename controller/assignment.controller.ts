import { Response, Request } from "express";
import classroomModel from "../schemas/classroom.schema";
import { response } from "../common/response";
import { handleError } from "../helpers/handleError";
import studentModel from "../schemas/student.schema";
import assignmentModel from "../schemas/assignment.schema";


export const createAssignment =async (req: Request, res: Response) => {
    
    try {
        const { classroom_id } = req.params;

        const  { assign_name, assign_detail, assign_due } = req.body;

        const student = await studentModel.find({classroom_id:classroom_id});

        const studentMap = student.map((item) => {
            const studentObj = {
                no: item.no,
                firstname: item.firstname,
                lastname: item.lastname,
                handin: false
            }
            return studentObj
        })
        console.log(studentMap)
        
        await assignmentModel.create({ 
            classroom_id: classroom_id,
            assign_create: new Date(),
            assign_due: assign_due,
            assign_name: assign_name,
            assign_detail: assign_detail,
            student: studentMap
        })

       response(res,200, "success", "Create Assignment done", null);

    }catch (error) {
        console.log(error)
        handleError(res,error);
    }
}

// export const getAllAssignment =async (req: Request, res: Response) => {
    
//     try {
//         const classroomId  = req.params.classroom_id;

//         const classroom = await classroomModel.findById({ _id: classroomId});
//         if (!classroom) {
//             return response(res,404, "fail", "Not found",null);
//         }
        
//         response(res,200, "success", "Find assignment done",classroom.assigment);
//     }catch (error) {
//         console.log(error)
//         handleError(res,error);
//     }
// }

// export const getAssignmentById =async (req:Request, res: Response) => {
//     try {
//         const { classroom_id, assignment_id } = req.params;

//         const classroom = await classroomModel.findById({ _id: classroom_id});

//         if (!classroom) {
//             return response(res,404, "fail", "Not found",null)
//         }
//         console.log(classroom)

//         const assigmentFilter = classroom?.assigment
//             .filter((assignment:any) =>  assignment._id.toString() === assignment_id)
//             .map((assignment:any) => {
//                 const assObj = {
//                     name: assignment.name,
//                     detail: assignment.detail,
//                     id: assignment._id.toString()
//                 }
//                 return assObj
//             })
//         console.log(assigmentFilter)

//         if (assigmentFilter.length === 0) {
//             return response(res,404,"fail", "Not found assignment",null)
//         }

//         response(res,200, "success", "Find assignment done",assigmentFilter?.at(0));

//     }catch(error) {
//         console.log(error)
//         handleError(res,error);
//     }
// }

// export const updateAssignmentById = async (req: Request, res: Response) => {
//     try {
//         const { classroom_id, assignment_id } = req.params;
//         const { assignment_name, assignment_detail } = req.body;

//         const classroom = await classroomModel.findById({ _id: classroom_id});
//         if (!classroom) {
//             return response(res,404, "fail", "Not found classroom",null)
//         }

//         if (classroom?.assigment.length === 0) {
//             return response(res,404, "fail", "classroom not have assignment",null);
//         }

//         await classroomModel.updateOne({ _id: classroom_id, 'assignment._id': assignment_id },
//             {
//                 $set: {
//                     'assignment.$[x].name': assignment_name,
//                     'assignment.$[x].detail': assignment_detail,
//                 }
//             },
//             {
//                 arrayFilters: [{ 'x._id': assignment_id }]
//             }
//         );

//         response(res,200, "success", "Update assignment done",null)
//     }catch (error) {
//         console.log(error)
//         handleError(res,error);
//     }
// }

