import "reflect-metadata";
import "dotenv/config";
import app from "./app";
import { AppDataSource } from "./config/typeorm";
// import redisClient from "./config/redis";
import fs from "fs";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      console.log("Uploads directory created.");
    }

    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    // await redisClient.connect();
    // console.log("Connection to Redis server is successful.");

    // await redisClient.set("test_key", "test_value");
    // const result = await redisClient.get("test_key");
    // console.log("Redis GET result:", result);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start error:", error);
  }
};

startServer();
