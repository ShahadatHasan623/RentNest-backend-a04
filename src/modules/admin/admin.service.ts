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

const updateUserStatus = async (
  id: string,
  activeStatus: ActiveStatus
) => {
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

export const adminService = {
  getAllUser,
  updateUserStatus,
};
