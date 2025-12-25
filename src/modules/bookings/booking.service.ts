interface BookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string; // "2024-01-15"
  rent_end_date: string;   // "2024-01-20"
}


import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/DB";

const createBooking = async(payload : Record<string,unknown>) => {
  const {customer_id, vehicle_id, rent_start_date, rent_end_date} = payload;

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  const totalDays = (end.getTime() - start.getTime())/86400000;


  const VehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id = $1`,[vehicle_id]);
  const rent = VehicleResult.rows[0].daily_rent_price;
  const totalCost = totalDays*rent;

  if(VehicleResult.rows[0].availability_status==='booked'){
    return false;
  }

  const updateStatusVehicle = await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`,[vehicle_id]);
  const status = 'active';


  const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,[customer_id, vehicle_id, rent_start_date, rent_end_date,totalCost,status]);

  const vehicle = (await pool.query(`SELECT vehicle_name,registration_number FROM vehicles WHERE id=$1`,[vehicle_id])).rows[0];

  const finalResult = result.rows[0];
  // console.log(finalResult);
  return {finalResult,vehicle};
}

const getBooking = async(payload: Record<string,unknown>,user : Record<string,unknown>) => {
  const receivedRole = user.role;
  const receivedId = user.id;
  console.log('look ',user);

  if(receivedRole==='admin'){
    const result = await pool.query(`SELECT       b.id,b.customer_id,b.vehicle_id,b.rent_start_date,b.rent_end_date,b.total_price,b.status,
  (
    SELECT json_build_object('name', u.name,'email', u.email) 
    FROM users u WHERE u.id = b.customer_id
  ) AS customer,
  (
    SELECT json_build_object('vehicle_name', v.vehicle_name,'registration_number', v.registration_number)
    FROM vehicles v WHERE v.id = b.vehicle_id
  ) AS vehicle
FROM bookings b`
);

return result.rows;

  }else if(receivedRole==='customer'){
      const result = (await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`,[receivedId])).rows[0];

      // console.log(result);

      const vehicle = (await pool.query(`SELECT vehicle_name,registration_number FROM vehicles WHERE id=$1`,[result.vehicle_id])).rows[0];

      return {result,vehicle};
  }
}

const updateBookingStatus = async(payload: Record<string,unknown>, user: Record<string,unknown>,id : string) => {
  const {role} = user;
  if(role==='admin'){
    const statusVehicle = 'available';
    const statusBooking = 'returned';
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`,[id]);
    const updatedStatus = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,[statusBooking,id]);
    
    const vehicle = result.rows[0].vehicle_id;
    // console.log(user,vehicle);
    const updatedVehicle = await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`,[statusVehicle,vehicle]);

    const customerResult = await pool.query(`SELECT * FROM bookings`);

    const vehicleStatusNow = await pool.query(`SELECT availability_status FROM vehicles WHERE id = $1`,[vehicle]);

    const returnCustomer = customerResult.rows[0];
    const returnVehicleStatus = vehicleStatusNow.rows[0];
    return [returnCustomer, returnVehicleStatus];
  }else if(role==='customer'){
    const statusVehicle = 'available';
    const statusBooking = 'cancelled';
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`,[id]);
    const updatedStatus = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,[statusBooking,id]);
    // const deletedBooking = await pool.query(`DELETE FROM bookings WHERE id=$1`,[id]);
    const user = result.rows[0].customer_id;
    const vehicle = result.rows[0].vehicle_id;
    // console.log(user,vehicle);
    const updatedVehicle = await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`,[statusVehicle,vehicle]);

    const customerResult = await pool.query(`SELECT * FROM bookings`);
    return customerResult.rows[0];
  }
}

export const bookingService = {
  createBooking,getBooking,updateBookingStatus
}