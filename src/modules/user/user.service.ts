import config from "../../config";
import { prisma } from "../../lib/prisma";
import User from "./user.interface";
import bcrypt from "bcrypt";

const registerUser = async (payload: User) => {
  const { name, email, password, image,role } = payload;
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

export const userService = {
  registerUser,
  getMyProfile,
};
