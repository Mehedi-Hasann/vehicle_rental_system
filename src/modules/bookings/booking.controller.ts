import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/DB";


const createBooking = async(req: Request, res: Response) => {
  try{
    const result = await bookingService.createBooking(req.body);

    if(!result){
      res.status(404).json({
        success : false,
        message : "Vehicle is not Available"
      });
    }
      res.status(201).json({
        success : true,
        message : "Booking created successfully",
        data : result
    });
  }catch(err: any){
    res.status(500).json({
      success : false,
      message : err.message
    })
  }
}

const getBooking = async(req: Request, res: Response) => {
  try{
    const result = await bookingService.getBooking(req.body, req.user as JwtPayload);

    if(!result){
      res.status(404).json({
        success : false,
        message : 'Result is not Found'
      })
    }

    res.status(200).json({
      success : true,
      message : 'Bookings retrieved successfully',
      data : result
    })
    
  }catch(err: any){
    res.status(500).json({
      success : false,
      message : err.message
    })
  }
}

const updateBookingStatus = async(req: Request, res: Response) => {
  try{

    const result = await bookingService.updateBookingStatus(req.body, req.user as JwtPayload, req.params.bookingId as string);
    res.status(200).json({
      success : true,
      message : "Booking cancelled successfully",
      data : result
    })
  }catch(err: any){
    res.status(500).json({
      success : false,
      message : err.message
    })
  }
}

export const bookingController = {
  createBooking, getBooking, updateBookingStatus
}