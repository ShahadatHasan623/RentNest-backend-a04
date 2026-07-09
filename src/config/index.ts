import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  app_url: process.env.APP_URL || "http://localhost:3000",
  port: process.env.PORT || 5000,
  bcrypt_round_salt: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret_token:process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret_token:process.env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in:process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_expires_in:process.env.JWT_REFRESH_EXPIRES_IN!
};
