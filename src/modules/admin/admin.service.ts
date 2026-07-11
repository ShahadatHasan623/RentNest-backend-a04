import { ActiveStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUser = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    omit: {
      password: true,
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.user.count();

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const updateUserStatus = async (id: string, activeStatus: ActiveStatus) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      activeStatus,
    },
  });
};
const getAllProperties = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const properties = await prisma.properties.findMany({
    skip,
    take: limit,
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

  const total = await prisma.properties.count();

  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
    },
  };
};
const getAllRental = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const rentals = await prisma.rentalRequest.findMany({
    skip,
    take: limit,
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const total = await prisma.rentalRequest.count();
  return {
    data: rentals,
    meta: {
      page,
      limit,
      total,
    },
  };
};
export const adminService = {
  getAllUser,
  updateUserStatus,
  getAllProperties,
  getAllRental
};
