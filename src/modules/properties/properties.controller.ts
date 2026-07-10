import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./properties.service";
import { sendResponse } from "../../utils/SendResponse";
import httpsStatus from "http-status";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id as string;
    const payload = req.body;
    const result = await propertyService.createProperty(payload, id);
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "properties created successfullt!",
      data: result,
    });
  }
);

const getAllProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await propertyService.getAllProperties(query);
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Properties All Retrived Successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await propertyService.getSingleProperty(id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Get single properties retrives successfully!",
      data: result,
    });
  }
);

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await propertyService.updateProperty(
      id as string,
      payload,
      userId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Properties Deleted successfully!",
      data: result,
    });
  }
);
const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id as string;

    const result = await propertyService.deleteProperty(id as string, userId);
    sendResponse(res,{
      success:true,
      statusCode:httpsStatus.OK,
      message:"properties deleted successfully",
      data:result
    })
  }
);

export const propertyController = {
  createProperty,
  getAllProperty,
  getSingleProperty,
  updateProperty,
  deleteProperty
};
