/** @format */

import mongoose from "mongoose";

/**
 * Function, which connects server to the database.
 */
export const database = async () => {
  const databaseUri = process.env.MONGO_URI;
  if (!databaseUri) {
    process.exit(1);
  }
  await mongoose.connect(databaseUri);
};

// Performs, when mongoose connection is connected.
mongoose.connection.on("connected", () => {
  console.log("[database] mongoDB connected");
});

// Performs, when mongoose connection is disconnected.
mongoose.connection.on("disconnected", () => {
  console.warn("[database] mongoDB disconnected");
});

// Performs, when mongoose connection has any error.
mongoose.connection.on("error", (err: mongoose.MongooseError) => {
  mongoose.disconnect();
});
