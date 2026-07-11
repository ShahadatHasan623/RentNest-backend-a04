import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {


    const { rentalRequestId } = req.body;

    const id = req.user?.id as string;
    const result = await paymentService.createPayment(rentalRequestId, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Checkout session created successfully",
      data: result,
    });
  }
);
const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  await paymentService.stripeWebhook(req.body, signature);

  sendResponse(res,{
   success:true,
   statusCode:httpStatus.OK,
   message:"Stripe webhook retrived successfully",
   data:null
  })
});
const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getMyPayments(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});
const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getPaymentById(
    req.params.id as string,
    req.user!.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  stripeWebhook,
  getMyPayments,
  getSinglePayment,
};
