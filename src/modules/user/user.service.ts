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
const getAllUsers = async () => {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
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
