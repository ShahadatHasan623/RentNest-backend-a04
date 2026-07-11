import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();
router.post("/create", auth(Role.TENANT), paymentController.createPayment);
router.post("/webhook", paymentController.stripeWebhook);

export const paymentsRoute = router;
