import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status"

const reviewCreate =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   const id =req.user?.id as string;
   const payload =req.body;
   const result =await reviewService.reviewCreate(id,payload)
   sendResponse(res,{
      success:true,
      statusCode:httpStatus.CREATED,
      message:"Review created successfully",
      data:result
   })
})
const getPropertyReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getPropertyReviews(
    req.params.propertyId as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});


export const reviewController ={
   reviewCreate,
   getPropertyReviews
}