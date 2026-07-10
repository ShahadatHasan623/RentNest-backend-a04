import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rentel.service";
import { sendResponse } from "../../utils/SendResponse";
import httpsStatus from "http-status"

const createRentalRequest =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const id =req.user?.id;
   const payload =req.body;
   
   const result =await rentalService.createRentalRequest(id as string ,payload)

   sendResponse(res,{
      success:true,
      statusCode:httpsStatus.CREATED,
      message:"Rental Created Successfully!",
      data:result
   })
})

export const rentalController={
   createRentalRequest
}