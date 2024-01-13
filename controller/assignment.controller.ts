// import { Response, Request } from "express";
// import classroomModel from "../schemas/classroom.schema";
// import { response } from "../common/response";
// import { handleError } from "../helpers/handleError";


// export const createAssignment =async (req: Request, res: Response) => {
    
//     try {
//         const classroomId = req.params.classroom_id;

//         const  { assignment_name, assignment_detail } = req.body;

//         const classroom = await classroomModel.findById({_id:classroomId});

//         if (!classroom ) {
//             return response(res,404, "fail", "Not found assignment",null);
//         }

//         const assigmentObj = {
//             name: assignment_name,
//             detail: assignment_detail
//         }

//        if (classroom?.assigment) {

//         await classroomModel.updateOne({ _id: classroomId}, {
//             assigment: [...classroom?.assigment,assigmentObj]
//         });
//        } else {
//             await classroomModel.updateOne({ _id: classroomId},{
//                 assigment: [assigmentObj]
//             });
//        }
//        response(res,200, "success", "Create Assignment done", null);

//     }catch (error) {
//         console.log(error)
//         handleError(res,error);
//     }
// }

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

