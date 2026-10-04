import { Router } from "express";
import express from "express";

import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

// Stripe webhook MUST receive raw body
router.post("/confirm/webhook", paymentController.stripeWebhook);

router.post("/create", auth(Role.TENANT), paymentController.createPayment);

router.get("/", auth(Role.TENANT), paymentController.getMyPayments);

router.get("/:id", auth(Role.TENANT), paymentController.getSinglePayment);

export const paymentsRoute = router;
