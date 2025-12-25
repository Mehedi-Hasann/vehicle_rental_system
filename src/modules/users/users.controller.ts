import { Request, Response } from "express"
import { usersService } from "./users.service"
import { JwtPayload } from "jsonwebtoken";



const getAllUsers = async(req: Request, res: Response) => {
  try{
    const {role,id} = req.user as JwtPayload;
    console.log(req.user);
    const result = await usersService.getAllUsers();

    res.status(200).json({
      success : true,
      message : "Users retrieved successfully",
      data : result
    })
  }catch(err: any){
    res.status(500).json({
      success : false,
      message : err.message
    })
  }

}

const updateUser = async(req:Request, res: Response) => {
  try{
    const result = await usersService.updateUser(req.body, req.params.userId as string);

    res.status(200).json({
      success : true,
      message : "User updated successfully",
      data : result
    })

  }catch(err: any){
    res.status(500).json({
      success : false,
      message : err.message
    })
  }
}

const deleteUser = async(req: Request, res: Response) => {
  try{
    const result = await usersService.deleteUser(req.params.userId as string);
    if(!result){
      res.status(403).json({
        success : false,
        message : "User is currently active"
      })
    }
    else if(result.rowCount===0){
      res.status(404).json({
        success : false,
        message : "User is not Found"
      })
    }else{
      res.status(200).json({
        success : true,
        message : "User deleted successfully"
      })
    }
  }catch(err: any){
    res.status(500).json({
      success : false,
      message : err.message
    })
  }
}

export const usersController = {
  getAllUsers,updateUser,deleteUser
}