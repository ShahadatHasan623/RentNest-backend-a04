import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();
router.post("/", auth(Role.TENANT), reviewController.reviewCreate);
router.get("/property/:propertyId", reviewController.getPropertyReviews);
export const reviewRoute = router;
