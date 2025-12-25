import { pool } from "../../config/DB"


const getAllUsers = async() => {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
}

const updateUser = async(payload: Record<string,unknown>, id : string) => {
  const {name, email, phone, role} = payload;

  const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id = $5 RETURNING *`,[name,email,phone,role,id]);
  
  console.log(result);

  return result.rows;
}

const deleteUser = async(id: string) => {
  const bookingStatus = await pool.query(`SELECT status FROM bookings WHERE customer_id=$1`,[id]);
  
  // console.log(bookingStatus.rows[0].status);
  if(bookingStatus.rows[0].status==='active'){
    return false;
  }
  const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`,[id]);
  // console.log(result);
  return result;
}

export const usersService = {
  getAllUsers,updateUser,deleteUser,
}