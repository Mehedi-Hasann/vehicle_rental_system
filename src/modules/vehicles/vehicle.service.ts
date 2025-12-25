import { pool } from "../../config/DB"


const createVehicle = async(payload : Record<string,unknown>) => {
  const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = payload;
  const result = await pool.query(`INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,[vehicle_name,type,registration_number,daily_rent_price,availability_status]);
  console.log(result);

  const vehicle = result.rows[0];
  return {vehicle};
}

const getAllVehicles = async(payload: Record<string,unknown>) => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  const allVehicles = result.rows;
  return {allVehicles};
}

const getSingleVehicle = async(id: string) => {
  // console.log(id);
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`,[id]);
  const singleVehicle = result.rows;
  // console.log(singleVehicle);

  if(singleVehicle.length===0){
    return false;
  }
  return {singleVehicle};
}

const updateVehicle = async(payload: Record<string,unknown> ,id : string) => {
  const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = payload;

  const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1 , type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id = $6 RETURNING *`,[vehicle_name,type,registration_number,daily_rent_price,availability_status,id]);

  const updated = result.rows[0];
  // console.log(updated);

  return updated;
}

const deleteVehicle = async(id: string) => {
  const bookingStatus = await pool.query(`SELECT status FROM bookings WHERE vehicle_id=$1`,[id]);
  
  console.log(bookingStatus.rows[0].status);
  if(bookingStatus.rows[0].status==='active'){
    return false;
  }
  // console.log(id);
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`,[id]);
  return result;
}


export const vehicleService = {
  createVehicle,getAllVehicles,getSingleVehicle,updateVehicle,deleteVehicle
}