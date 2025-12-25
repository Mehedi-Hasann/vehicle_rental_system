import { NextFunction, Request, Response } from "express";
import { pool } from "../config/DB";

interface BookingRow {
  vehicle_id : number;
}

export const autoUpdate = async(req: Request, res: Response, next: NextFunction) => {

  const updateBookingStatus = await pool.query(`UPDATE bookings SET status = 'returned' WHERE rent_end_date < NOW() AND status='active' RETURNING vehicle_id`);

  const updateVehicleStatus = await pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id=ANY($1)`,[updateBookingStatus.rows.map((row: BookingRow) => row.vehicle_id)]);

  next();
}