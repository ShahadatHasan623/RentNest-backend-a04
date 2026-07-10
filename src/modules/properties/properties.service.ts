import { prisma } from "../../lib/prisma";
import { ICreateProperty } from "./properties.interface";

const createProperty = async (payload: ICreateProperty, landlordId: string) => {
  const {} = payload;
  const category = await prisma.categories.findUnique({
    where: {
      id: payload.categoryId,
    },
  });
  if (!category) {
    throw new Error("Category Not Found");
  }

  const createProperty = await prisma.properties.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
  });
  return createProperty;
};

export const propertyService = {
  createProperty,
};
