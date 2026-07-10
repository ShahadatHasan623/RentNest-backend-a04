import { PropertiesWhereInput } from "../../../generated/prisma/models";
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

  const property = await prisma.properties.create({
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
  return property;
};

const getAllProperties = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: PropertiesWhereInput[] = [];
  if (query.search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location,
        mode: "insensitive",
      },
    });
  }
  if (query.available !== undefined) {
    andConditions.push({
      available: query.available === "true",
    });
  }
  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      rent: {
        ...(query.minPrice && { gte: Number(query.minPrice) }),
        ...(query.maxPrice && { lte: Number(query.maxPrice) }),
      },
    });
  }

  const properties = await prisma.properties.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip,
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const totalProperties = await prisma.properties.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: properties,
    meta: {
      total: totalProperties,
      page:page,
      limit:limit,
      totalPage:Math.ceil(totalProperties / limit)
    },
  };
};

export const propertyService = {
  createProperty,
  getAllProperties,
};
