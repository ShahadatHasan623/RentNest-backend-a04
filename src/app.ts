import express, { Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import HttpStatus from "http-status";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./auth/auth.route";
import { categoryRoute } from "./modules/category/category.route";
import { propertiesRoute } from "./modules/properties/properties.route";
import { rentalRoute } from "./modules/rental/rental.route";
import { paymentsRoute } from "./modules/payments/payment.route";
import { reviewRoute } from "./modules/Review/review.route";
import { adminRoute } from "./modules/admin/admin.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
const app = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  })
);

app.use("/api/payments/confirm/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/payments", paymentsRoute);
app.get("/", (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: "Rentnest Root layout",
  });
});

app.use("/api/auth", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/properties", propertiesRoute);
app.use("/api/landlord/properties", propertiesRoute);
app.use("/api/rentals", rentalRoute);
app.use("/api/reviews",reviewRoute)
app.use("/api/admin",adminRoute)
app.use(globalErrorHandler)

export default app;
