import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";

const reviewCreate = async (tenantId: string, payload: IReview) => {
  const { propertyId, rating, comment } = payload;

  // 1. Check property
  const property = await prisma.properties.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found.");
  }

  // 2. Find tenant's rental
  const rental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
    },
    include: {
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("REVIEW TENANT ID:", tenantId);
  console.log("REVIEW PROPERTY ID:", propertyId);

  console.log("RENTAL FOUND:", {
    id: rental?.id,
    status: rental?.status,
    tenantId: rental?.tenantId,
    propertyId: rental?.propertyId,
    paymentStatus: rental?.payment?.status,
  });

  if (!rental) {
    throw new Error("You can review only a property you have rented.");
  }

  // 3. Payment must be completed
  if (rental.payment?.status !== PaymentStatus.COMPLETED) {
    throw new Error("You can review only after completing the payment.");
  }

  // 4. Prevent duplicate review
  const alreadyReview = await prisma.review.findFirst({
    where: {
      tenantId,
      propertyId,
    },
  });

  if (alreadyReview) {
    throw new Error("You already reviewed this property.");
  }

  // 5. Create review
  const review = await prisma.review.create({
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

  return review;
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
