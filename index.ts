/** @format */

// Libraries.
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

// Configures .env file.
dotenv.config();

// Modules.
import { database, corsOptions } from "@/config";
import { sessionConfig } from "@/session";
import {
  AllowedCorsMiddleware,
  ErrorsHandlerMiddleware,
  AuthorizedSessionMiddleware,
} from "@/middlewares";

// Initializes ExpressJS application.
const app = express();

// MongoDB configurations.
database();

// Trust proxy and enables sessions between back-end and front-end
app.set("trust proxy", 1);

// Sessions.
app.use(sessionConfig());

// Security-related middlewares
app.use(helmet());
app.use(AllowedCorsMiddleware);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(AuthorizedSessionMiddleware);
app.use(express.static(path.join(__dirname, "../public")));

// Catch-all route handler for all paths and checks if request is made through browser.
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  const acceptHeader = req.header("Accept");
  const isBrowserRequest = acceptHeader && acceptHeader.includes("text/html");

  // Checks, if API is reached through the browser, then we show only static page.
  if (isBrowserRequest) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }
  next();
});

// Initializes API routes.
import {
  AuthRouter,
  OrganizationRouter,
  TeamRouter,
  TrainerRouter,
  AthleteRouter,
  TestingRouter,
} from "@/routes";

// Initializes routers.
const authRouter = new AuthRouter();
const organizationRouter = new OrganizationRouter();
const teamRouter = new TeamRouter();
const trainerRouter = new TrainerRouter();
const athleteRouter = new AthleteRouter();
const testingRouter = new TestingRouter();

app.use("/api/auth", authRouter.Routes);
app.use("/api/organization", [
  organizationRouter.Routes,
  organizationRouter.Admin,
]);
app.use("/api/team", [teamRouter.Routes, teamRouter.Admin]);
app.use("/api/trainer", [trainerRouter.Routes, trainerRouter.Admin]);
app.use("/api/athlete", [athleteRouter.Routes, athleteRouter.Admin]);
app.use("/api/testing", [testingRouter.Routes, testingRouter.Admin]);

// Errors handling middleware.
app.use(ErrorsHandlerMiddleware);

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("SIGINT", () => {
  process.exit(0);
});

process.on("SIGTERM", () => {
  process.exit(0);
});

// Checks, if server's port exists in .env file.
const serverPort = process.env.SERVER_PORT;
if (!serverPort) {
  process.exit(0);
}

app.listen(serverPort, () => {
  console.log(`[server] running on ${serverPort} port`);
});
