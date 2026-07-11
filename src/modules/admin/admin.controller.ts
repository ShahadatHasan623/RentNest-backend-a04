import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/SendResponse";
import  httpStatus  from "http-status";

const getAllUser =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   
   const result =await adminService.getAllUser(req.query);
   sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
      message:"Users retrieved successfully",
      data:result.data,
      meta:result.meta
   })
})

export const adminController ={
   getAllUser
}