import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface";

const createRentalRequest = async (
  tenantId: string,
  payload: IRentalRequest
) => {
  const property = await prisma.properties.findUnique({
    where: {
      id: payload.propertyId,
    },
  });
  if (!property) {
    throw new Error("Property Not found");
  }
  if (!property.available) {
    throw new Error("Property is not available");
  }
  const alreadyRequested = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: payload.propertyId,
      tenantId,
      status: RentalStatus.PENDING,
    },
  });
  if (alreadyRequested) {
    throw new Error("You already requested this property");
  }
  const rental = await prisma.rentalRequest.create({
    data: {
      tenantId,
      landlordId: property.landlordId,
      propertyId: payload.propertyId,
      moveInDate: new Date(payload.moveInDate),
      duration: payload.duration,
    },
    include:{
      property:true,
      tenant:{
         omit:{
            password:true
         }
      },
      landlord:{
         omit:{
            password:true
         }
      }
    }
  });
  return rental;
};

export const rentalService = {
  createRentalRequest,
};
