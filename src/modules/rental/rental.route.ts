import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router();

router.post("/", auth(Role.TENANT), rentalController.createRentalRequest);
router.get("/", auth(Role.TENANT), rentalController.getMyRentals);
router.get(
  "/landlord/requests",
  auth(Role.LANDLORD),
  rentalController.landlordRequests
);
router.get("/:id", auth(Role.TENANT), rentalController.getSingleRental);
router.patch(
  "/landlord/requests/:id",
  auth(Role.LANDLORD),
  rentalController.updateStatus
);

export const rentalRoute = router;
