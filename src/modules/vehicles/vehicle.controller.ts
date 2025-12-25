import { Request, Response } from "express"
import { pool } from "../../config/DB"
import { vehicleService } from "./vehicle.service"


const createVehicle = async(req: Request, res: Response) => {
  try{
    const result = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success : true,
      message : "Vehicle created successfully",
      data : result
    })
  }catch(err:any){
    res.status(500).json({
      success : false,
      message : err.message
    })
  }
}

const getAllVehicles = async(req:Request, res: Response) => {
  try{
    const result = await vehicleService.getAllVehicles(req.body);
    res.status(200).json({
      success : true,
      message : "Vehicles retrieved successfully",
      data : result
    })
  }catch(err: any){
    res.status(500).json({
      success: false,
      message : err.message
    })
  }
}

const getSingleVehicle = async(req:Request, res: Response) => {
  try{
    const result = await vehicleService.getSingleVehicle(req.params.vehicleId as string);
    if(!result){
      res.status(404).json({
        success : false,
        message : "Vehicle is not Exists...TaTa ByBy"
      })
    }
    res.status(200).json({
      success : true,
      message : "Vehicles retrieved successfully",
      data : result
    })
  }catch(err: any){
    res.status(500).json({
      success: false,
      message : err.message
    })
  }
}

const updateVehicle = async(req:Request, res: Response) => {
  try{
    const result = await vehicleService.updateVehicle(req.body, req.params.vehicleId as string);
    console.log(result);
    if(!result){
      res.status(404).json({
        success : false,
        message : "Vehicle is not Exists...TaTa ByBy"
      })
    }
    res.status(200).json({
      success : true,
      message : "Vehicles updated successfully",
      data : result
    })
  }catch(err: any){
    res.status(500).json({
      success: false,
      message : err.message
    })
  }
}

const deleteVehicle = async(req:Request, res: Response) => {
  try{
    const result = await vehicleService.deleteVehicle(req.params.vehicleId as string);
    if(!result){
      res.status(403).json({
        success : false,
        messaage : "Vehicle is currently active"
      });
    }
    else if(result.rowCount==0){
      res.status(404).json({
        success : false,
        message : "Result is not Found"
      })
    }else{
      res.status(200).json({
        success: true,
        messaage : "Vehicle deleted successfully"
      })
    }
  }catch(err: any){
    res.status(500).json({
      success: false,
      message : err.message
    })
  }
}

export const vehicleController = {
  createVehicle,getAllVehicles,getSingleVehicle,updateVehicle,deleteVehicle
}