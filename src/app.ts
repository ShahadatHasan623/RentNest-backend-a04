import express, { Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
import  HttpStatus  from 'http-status';
import { userRoute } from './modules/user/user.route';
import { authRoute } from './auth/auth.route';
import { categoryRoute } from './modules/category/category.route';
import { propertiesRoute } from './modules/properties/properties.route';
const app=express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/',(req:Request,res:Response)=>{
     res.status(HttpStatus.OK).json({
          success:true,
          message:"Rentnest Root layout"
     })
})

app.use('/api/auth',userRoute)
app.use('/api/auth',authRoute)
app.use("/api/categories", categoryRoute);
app.use("/api/properties",propertiesRoute)

export default app;