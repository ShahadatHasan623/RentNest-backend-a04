import app from "./app";
import config from "./config";
const PORT = config.port;
const main = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting the server:", error);
  }
};
main()