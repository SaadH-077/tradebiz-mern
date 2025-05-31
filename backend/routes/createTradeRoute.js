import express from "express";
import UserModel from "../models/UserModel.js"; 
import TradeModel from "../models/TradeModel.js";
import OfferModel from "../models/OfferModel.js";

// Creating a new instance of the express router
const router = express.Router();

router.post("/trades", async (req, res) => {
    try 
    {

        const { title, description, conditions , creator, creatorName} = req.body;

        // console.log("Title: ", title); // Debugging statement to check the extracted trade details
        // console.log("Description: ", description);
        // console.log("Conditions: ", conditions);
        // console.log("Creator: ", creator);
        // console.log("Creator Name: ", creatorName);

        // Create a new trade instance using the Mongoose model
        const newTrade = new TradeModel({
            title,
            description,
            conditions,
            creator,
            creatorName
        });

        // Save the new trade to the database
        await newTrade.save();

        // Respond with success message
        res.status(201).json({
            success: true,
            message: 'Trade created successfully!',
            trade: newTrade // Send back the created trade object
        });
    } 
    catch (error) 
    {
        console.error('Error creating trade:', error);
        res.status(500).json({ success: false, message: 'Error creating trade. Please try again.' });
    }
});


export { router };