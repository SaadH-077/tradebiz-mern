import express from "express";
import UserModel from "../models/UserModel.js";
import TradeModel from "../models/TradeModel.js";
import OfferModel from "../models/OfferModel.js";
import mongoose from "mongoose";

// Creating a new instance of the express router
const router = express.Router();


// Route to fetch offers for a specific trade
router.get('/offer-info', async (req, res) => {
    // console.log("REQUEST PARAMS: ", req.query); // Debugging statement to check the request parameters
  try 
  {
    const { tradeId } = req.params;
    // console.log("Trade ID: ", tradeId); // Debugging statement to check the extracted trade ID
    const offers = await OfferModel.find({ trade: tradeId });
    if (!offers) 
    {
      return res.status(404).json({ message: "No offers found for this trade" });
    }
    res.json(offers);
  } 
  catch (error) 
  {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router };
