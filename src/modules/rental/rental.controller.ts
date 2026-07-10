import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rentel.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status"

const createRentalRequest =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const id =req.user?.id;
   const payload =req.body;
   
   const result =await rentalService.createRentalRequest(id as string ,payload)

   sendResponse(res,{
      success:true,
      statusCode:httpStatus.CREATED,
      message:"Rental Created Successfully!",
      data:result
   })
})
const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getMyRentals(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental list retrieved",
    data: result,
  });
});

const getSingleRental = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getSingleRental(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental details retrieved",
    data: result,
  });
});

const landlordRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getLandlordRequests(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved",
    data: result,
  });
});

export const rentalController={
   createRentalRequest,
   getMyRentals,
   getSingleRental,
   landlordRequests
}