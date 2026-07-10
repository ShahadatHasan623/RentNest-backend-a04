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
const getAllCategories =async()=>{
   const getCategory =await prisma.categories.findMany({
      orderBy:{
         createdAt:"desc"
      }
   })
   return getCategory
}

const updateCategories =async(payload:ICategory,id:string)=>{
   const{name} =payload
   await prisma.categories.findUniqueOrThrow({
      where:{
         id
      }
   })
   const updateCategory =await prisma.categories.update({
      where:{
         id
      },
      data:{
         name
      }
   })
   return updateCategory
}
const deleteCategories =async(id:string)=>{
  await prisma.categories.findUniqueOrThrow({
      where:{
         id
      }
   })
   const deleteCategory =await prisma.categories.delete({
      where:{
         id
      }
   })
   return deleteCategory;
}
export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategories,
  deleteCategories
};
