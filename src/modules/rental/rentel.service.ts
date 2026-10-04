import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const createRentalRequest = async (
  payload: {
    propertyId: string;
    moveInDate: string;
    duration: number;
  },
  tenantId: string
) => {
  if (!payload.propertyId) {
    throw new Error("Property ID is required");
  }

  if (!payload.moveInDate) {
    throw new Error("Move-in date is required");
  }

  if (!payload.duration) {
    throw new Error("Duration is required");
  }

  const property = await prisma.properties.findUniqueOrThrow({
    where: {
      id: payload.propertyId,
    },
  });
  if (!property.available) {
    throw new Error("This property is not available");
  }

  const moveInDate = new Date(payload.moveInDate);

  if (Number.isNaN(moveInDate.getTime())) {
    throw new Error("Invalid move-in date");
  }

  const rental = await prisma.rentalRequest.create({
    data: {
      tenantId,
      landlordId: property.landlordId,
      propertyId: property.id,
      moveInDate,
      duration: Number(payload.duration),
    },
    include: {
      property: true,
      tenant: {
        omit: {
          password: true,
        },
      },
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });
  return rental;
};
const getMyRentals = async (tenantId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },

    include: {
      property: true,
      payment: true,
    },
  });
};
const getSingleRental = async (id: string) => {
  const singleRental = prisma.rentalRequest.findUniqueOrThrow({
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
  const rentals = await prisma.rentalRequest.findMany({
    where: {
      landlordId,
    },
    include: {
      property: true,
      tenant: true,
    },
  });
  return rentals;
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

  // Only ACTIVE rental can be completed
  if (
    status === RentalStatus.COMPLETED &&
    rental.status !== RentalStatus.ACTIVE
  ) {
    throw new Error(
      "Only active rentals can be completed"
    );
  }

  const updatedRental =
    await prisma.rentalRequest.update({
      where: {
        id: rentalId,
      },
      data: {
        status,
      },
    });

  return updatedRental;
};



export const rentalService = {
  createRentalRequest,
  getMyRentals,
  getSingleRental,
  getLandlordRequests,
  updateRentalStatus,
};
