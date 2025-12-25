import { pool } from "../../config/DB"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


const createUser = async(payload : Record<string,unknown>) => {
    const {name, email, password, phone, role} = payload;

    const hashPassword = await bcrypt.hash(password as string, 10);

    const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,[name,email,hashPassword,phone,role]);
    return result;
}

const loginUser = async(payload: Record<string, unknown>) => {
  const {name,email,password} = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
  // console.log(result.rows[0]);
  if(!result){
    return false;
  }
  const match = await bcrypt.compare(password as string,result.rows[0].password);
  if(!match){
    return false;
  }
  const secret = 'KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
  const user = result.rows[0];

  const token = await jwt.sign({id: user.id, name: user.name, role : user.role, email : user.email}, secret, {
    expiresIn : '30d'
  });
  // console.log(token);

  return {token,user};

}

export const authService = {
  createUser,loginUser
}