import express, { Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
import  HttpStatus  from 'http-status';
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

export default app;