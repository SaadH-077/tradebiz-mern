import express from "express";
import UserModel from "../models/UserModel.js"; 
import TradeModel from "../models/TradeModel.js";
import OfferModel from "../models/OfferModel.js";
import { ObjectId } from "mongoose";
import mongoose from "mongoose";

// Creating a new instance of the express router
const router = express.Router();

router.get('/names', async (req, res) => {
    // console.log("REQUEST BODY: ", req.query); // Debugging statement to check the request body
    try 
    {
        const trades = await TradeModel.find({}).select('title');
        res.json(trades.map(trade => trade.title)); // Send an array of trade titles
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Route to create a new offer
router.post('/create', async (req, res) => {
    const {tradeId , creator, creatorName , username , quantity, cashOffered} = req.body;

    //get the user who is tryinh to make the offer
    const user = await UserModel.findById(creator);

    if(user.cash < cashOffered)
    {
        return res.json({ success: false, message: "Insufficient funds" });
    }

    if(user.itemsOwned < quantity)
    {
        return res.json({ success: false, message: "Insufficient items" });
    }

    //make sure the user has not offered to this particular trade before
    const existingOffer = await OfferModel.findOne({creator, offerForItem: tradeId});

    if(existingOffer)
    {
        return res.json({ success: false, message: "You have already made an offer to this trade" });
    }

    // Log the incoming data for debugging
    console.log("Creating offer with data (Backend):", req.body);



    try 
    {
        // console.log("making offer") 

        const newOffer = new OfferModel({
            creator, 
            creatorName,
            username,
            offerForItem: tradeId,
            itemsOffered: quantity,
            cashOffered: cashOffered,
        });

        const savedOffer = await newOffer.save();

        // find the Trade and update the offers array
        const trade = await TradeModel.findById(tradeId);
        trade.offers.push(savedOffer._id);

        await trade.save();

        console.log("Offer saved successfully:", savedOffer);
        res.json({ success: true, offer: savedOffer });
    }
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/user-offers', async (req, res) => {
    try 
    {
        const userId = req.query.userId; 
        // console.log("User ID: ", userId); // Debugging statement to check the extracted user ID

        const userOffers = await OfferModel.find({ creator: userId });
        // console.log("User offers: ", userOffers); // Debugging statement to check the user's offers

        res.json(userOffers);
    } 
    catch (error) 
    {
        console.error("Error fetching user's sent offers:", error);
        res.status(500).send(error);
    }
});
  





export { router };