import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/SendResponse";
import  httpStatus  from "http-status";

const createCategory = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const payload =req.body;
   const category =await categoryService.createCategory(payload)
   sendResponse(res,{
      success:true,
      statusCode:httpStatus.CREATED,
      message:"Categories created retrived successfully",
      data:category
   })
})
export const categoryController ={
   createCategory
}