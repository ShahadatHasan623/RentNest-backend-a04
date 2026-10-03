import { Router } from "express";

import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userController.getMyProfile
);

// Admin
router.get(
  "/",
  auth(Role.ADMIN),
  userController.getAllUsers
);

router.patch(
  "/:id/status",
  auth(Role.ADMIN),
  userController.updateUserStatus
);

export const userRoute = router;