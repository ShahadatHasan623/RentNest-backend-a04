import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./properties.service";
import { sendResponse } from "../../utils/SendResponse";
import httpsStatus from "http-status"

const createProperty =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const id =req.user?.id as string;
  const payload =req.body;
  const result =await propertyService.createProperty(payload,id)
  sendResponse(res,{
   success:true,
   statusCode:httpsStatus.CREATED,
   message:"properties created successfullt!",
   data:result
  })
})



export const propertyController={
   createProperty
}