import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router =Router();

router.post('/',auth(Role.TENANT),rentalController.createRentalRequest)
export const rentalRoute =router