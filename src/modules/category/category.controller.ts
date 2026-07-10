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
      message:"Categories created successfully",
      data:category
   })
})
const getAllCategories =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const categories =await categoryService.getAllCategories()
   sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
      message:"Categories retrieved successfully",
      data:categories
   })
})
export const categoryController ={
   createCategory,
   getAllCategories
}