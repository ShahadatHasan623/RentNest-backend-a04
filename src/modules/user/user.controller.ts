import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const user =await userService.registerUser(payload);
      sendResponse(res,{
         success:true,
         statusCode:httpStatus.CREATED,
         message:"User created successfully",
         data:user
      })
  }
);

export const userController = {
  registerUser,
};
