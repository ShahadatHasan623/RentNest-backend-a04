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
const getMyRentals = async (tenantId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },

    include: {
      property:true,
      payment: true,
    },
  });
};
const getSingleRental = async (id: string) => {
  const singleRental= prisma.rentalRequest.findUniqueOrThrow({
    where: {
      id,
    },

    include: {
      property: true,
      tenant: true,
      landlord: true,
      payment: true,
    },
  });
  return singleRental;
};

const getLandlordRequests = async (landlordId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      landlordId,
    },

    include: {
      property: true,
      tenant: true,
    },
  });
};
const updateRentalStatus = async (
  rentalId: string,
  landlordId: string,
  status: RentalStatus
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.landlordId !== landlordId) {
    throw new Error("Unauthorized");
  }

  return prisma.rentalRequest.update({
    where: {
      id: rentalId,
    },

    data: {
      status,
    },
  });
};

export const rentalService = {
  createRentalRequest,
  getMyRentals,
  getSingleRental,
  getLandlordRequests,
  updateRentalStatus
};
