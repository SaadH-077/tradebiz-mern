import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as authenticationRouter } from "./routes/authentication.js";
import { router as browseRouter } from "./routes/browseRoute.js";
import { router as createTradeRouter } from "./routes/createTradeRoute.js";
import { router as offerRouter } from "./routes/offerRoutes.js";
import { router as tradeRouter } from "./routes/tradeRoutes.js";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Defining the routes for the App
app.use("/auth", authenticationRouter);
app.use("/browse", browseRouter);
app.use("/create-trade", createTradeRouter);
app.use("/offers", offerRouter);
app.use("/trades", tradeRouter);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(err));

