import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { propertyController } from "./properties.controller";


const router =Router();

router.post('/',auth(Role.LANDLORD),propertyController.createProperty)

export const propertiesRoute =router;