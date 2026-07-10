import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createCategory = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   
})
export const categoryController ={
   createCategory
}