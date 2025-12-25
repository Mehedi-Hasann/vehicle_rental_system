import {Pool} from 'pg';

export const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_1TIElO6gwMmy@ep-autumn-dawn-ahwnqxnz-pooler.c-3.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

const initDB = async() => {
  try{
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin','customer'))
      )
      `)

      await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
          id SERIAL PRIMARY KEY,
          vehicle_name VARCHAR(100) NOT NULL,
          type VARCHAR(10) CHECK(type IN ('car','bike','van','SUV')),
          registration_number VARCHAR(100) UNIQUE NOT NULL,
          daily_rent_price INT CHECK (daily_rent_price > 0),
          availability_status	VARCHAR(50) CHECK(availability_status IN ('available','booked'))
        )
        `)
      
      await pool.query(`
         CREATE TABLE IF NOT EXISTS bookings(
          id SERIAL PRIMARY KEY,
          customer_id INT REFERENCES users(id) ON DELETE CASCADE,
          vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
          rent_start_date DATE,
          rent_end_date DATE,
          total_price INT NOT NULL CHECK (total_price > 0),
          status VARCHAR(50) CHECK(status IN ('active','cancelled','returned'))
         )
        `)

      console.log("DataBase created successfully!!");
  }catch(err: any){
    console.log("Connecting initDB() is caused Error!!!",err.message);
  }
}

export default initDB