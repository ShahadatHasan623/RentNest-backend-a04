import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";

const createCategory = async (payload: ICategory) => {
  const { name } = payload;
  const isExist = await prisma.categories.findUnique({
    where: {
      name,
    },
  });

  if (isExist) {
    throw new Error("Category already exists");
  }

  const category = await prisma.categories.create({
    data: payload,
  });

  return category;
};
export const categoryService = {
  createCategory,
};
