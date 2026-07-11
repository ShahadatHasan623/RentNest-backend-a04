import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
const stripe = new Stripe(config.stripe_secret_key as string);
const createPayment = async (rentalRequestId: string, userId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
      tenant: true,
    },
  });
  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }
  if (rentalRequest.tenantId !== userId) {
    throw new Error("Unauthorized");
  }
  if (rentalRequest.status !== "APPROVED") {
    throw new Error("Rental request is not approved");
  }
  const paymentExist = await prisma.payment.findUnique({
    where: {
      rentalRequestId,
    },
  });
  if (paymentExist && paymentExist.status === "COMPLETED") {
    throw new Error("Payment already completed");
  }
  const amount = rentalRequest.property.rent ?? 0;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: rentalRequest.property.title,
            description: rentalRequest.property.location ?? "",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    customer_email: rentalRequest.tenant.email,
    metadata: {
      rentalRequestId,
      tenantId: userId,
    },
    success_url: `${config.app_url}/payment/success`,
    cancel_url: `${config.app_url}/payment/cancel`,
  });
  if (!paymentExist) {
    await prisma.payment.create({
      data: {
        rentalRequestId,
        transactionId: session.id,
        amount,
        method: "CARD",
        provider: "STRIPE",
        status: "PENDING",
      },
    });
  }
  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};
const stripeWebhook = async (payload: Buffer, signature: string) => {
  if (!signature) {
    throw new Error("Stripe signature missing");
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret!
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const paymentId = session.metadata?.paymentId;

      if (!paymentId) break;

      const payment = await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      });

      if (!payment) break;

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: PaymentStatus.COMPLETED,
            transactionId: session.payment_intent as string,
            paidAt: new Date(),
          },
        });

        await tx.rentalRequest.update({
          where: {
            id: payment.rentalRequestId,
          },
          data: {
            status: RentalStatus.ACTIVE,
          },
        });
      });

      break;
    }

    default:
      console.log(`Unhandled Event: ${event.type}`);
  }

  return {
    received: true,
  };
};

const getMyPayments = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: userId,
      },
    },
    include: {
      rentalRequest: {
        include: {
          property: true,
          tenant: true,
          landlord: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};

export const paymentService = {
  createPayment,
  stripeWebhook,
  getMyPayments,
};
