import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";

const reviewCreate = async (tenantId: string, payload: IReview) => {
  const { propertyId, rating, comment } = payload;

  const property = await prisma.properties.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property Not Found");
  }

  const completeRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
    },
    include: {
      payment: true,
    },
  });

  if (!completeRental) {
    throw new Error("Rental request not found.");
  }

  if (completeRental.payment?.status !== "COMPLETED") {
    throw new Error("You can review only after completing the payment.");
  }

  const alreadyReview = await prisma.review.findFirst({
    where: {
      tenantId,
      propertyId,
    },
  });

  if (alreadyReview) {
    throw new Error("You already reviewed this property.");
  }

  return prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rating,
      comment,
    },
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: true,
    },
  });
};

const getPropertyReviews = async (propertyId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const average = await prisma.review.aggregate({
    where: {
      propertyId,
    },
    _avg: {
      rating: true,
    },
  });

  return {
    averageRating: average._avg.rating || 0,
    totalReviews: reviews.length,
    reviews,
  };
};

const getMyReviews = async (tenantId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      tenantId,
    },
    include: {
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

export const reviewService = {
  reviewCreate,
  getPropertyReviews,
  getMyReviews,
};
