
import dotenv from "dotenv";

dotenv.config();

import express, { Request, Response } from 'express'
import { authRoutes } from './auth/auth.route';
import initDB from '../config/DB';
import { vehiclesRoutes } from './vehicles/vehicle.route';
import { userRoutes } from './users/users.route';
import { bookingRoute } from './bookings/booking.route';
import { autoUpdate } from '../middleware/autoUpdate';
const app = express();
const port = process.env.PORT;


app.use(express.json());

initDB();

app.get('/',autoUpdate, (req: Request, res: Response) => {
  res.send('Hello World!');
})

//auth
app.use('/api/v1/auth',authRoutes);

///vehicles
app.use('/api/v1/vehicles',vehiclesRoutes);

//users
app.use('/api/v1/users',userRoutes);

//bookings
app.use('/api/v1/bookings',bookingRoute);

app.use((req: Request, res: Response)=>{
  res.status(404).json({
    success : false,
    message : "Path is not Found",
    path : req.path
  })
})

export default app;