import { z } from "zod";



const userValidationSchema = z.object({
    id:z.string(),
    password:z.string({invalid_type_error: "pasword must be a string",})
    .max(20,{message:'Password can not be more than 20 charater'})
    .optional(),
    

})

export const UserValidation = {
    userValidationSchema,

}