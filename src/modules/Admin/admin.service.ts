import { AdminModel, TAdmin } from "./admin.interface";
import { Admin } from "./admin.model";


const createAdminfromDB = async(payload:TAdmin)=>{
    const result = await Admin.create(payload);

    return result;

}


export const AdminService ={
    createAdminfromDB,
    
}