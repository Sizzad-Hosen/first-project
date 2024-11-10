
export type TUser = {
  id:string,
  password:string,
  needsPasswordChange:boolean,
  role:'student'|'admin'|'faculty',
  status:"in-progress"|"blocked",
  createdAt:string,
  updatedAt:string,
  isDeleted:boolean,
  }


export type NewUser = {
    password:string,
    role:string,

  }