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
const updateCategories =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const paylod =req.body;
   const id =req.params.id as string;
   const updatedCategory =await categoryService.updateCategories(paylod,id)
   sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
      message:"Categories updated successfully",
      data:updatedCategory
   })
})
const deleteCategories =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const {id}= req.params;
   const deletCategory =await categoryService.deleteCategories(id as string)
   sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
      message:"Category deleted successfully",
      data:deletCategory
   })
})
export const categoryController ={
   createCategory,
   getAllCategories,
   updateCategories,
   deleteCategories
}