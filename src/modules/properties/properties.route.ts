import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { propertyController } from "./properties.controller";


const router =Router();

router.post('/',auth(Role.LANDLORD),propertyController.createProperty)
router.get('/',propertyController.getAllProperty)
router.get('/:id',propertyController.getSingleProperty)
router.patch('/:id',auth(Role.LANDLORD),propertyController.updateProperty)
router.delete('/:id',auth(Role.LANDLORD),propertyController.deleteProperty)

export const propertiesRoute =router;