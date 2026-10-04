import config from "../../config";
import { prisma } from "../../lib/prisma";
import User from "./user.interface";
import bcrypt from "bcrypt";
import { ActiveStatus } from "../../../generated/prisma/enums";

const registerUser = async (payload: User) => {
  const { name, email, password, image, role } = payload;

  const isUsersExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUsersExist) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_round_salt)
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image,
      role,
      profile: {
        create: {
          image,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
      email: createUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

// Admin: Get all users
const getAllUsers = async (search?: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const where = search?.trim()
    ? {
        OR: [
          {
            name: {
              contains: search.trim(),
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search.trim(),
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      omit: {
        password: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const updateUserStatus = async (userId: string, status: ActiveStatus) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      activeStatus: status,
    },
  });

  return updatedUser;
};
export const userService = {
  registerUser,
  getMyProfile,
  getAllUsers,
  updateUserStatus,
};
