import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router =Router()
router.post('/',auth(Role.ADMIN),categoryController.createCategory)
router.get("/",categoryController.getAllCategories)
router.patch("/:id",auth(Role.ADMIN),categoryController.updateCategories)
export const categoryRoute =router