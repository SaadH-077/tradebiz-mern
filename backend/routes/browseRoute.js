import express from "express";
import UserModel from "../models/UserModel.js"; 
import TradeModel from "../models/TradeModel.js";
import OfferModel from "../models/OfferModel.js";
import mongoose from "mongoose";

// Creating a new instance of the express router
const router = express.Router();

// In your trades routes file
router.get("/trades", async (req, res) => {
    // console.log("REQUEST BODY: ", req.body); // Debugging statement to check the request body

    try 
    {
        const search = req.query.search;
        let query = { status: 'Open' };

        if (search) 
        {
            query = { ...query, title: new RegExp(search, 'i') }; // 'i' for case-insensitive
        }

        const ongoingTrades = await TradeModel.find(query);
        res.json(ongoingTrades);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Endpoint to fetch detailed user information by ID
router.get('/user-info', async (req, res) => {
    // console.log("REQUEST PARAMS: ", req.query); // Debugging statement to check the request parameters
    try 
    {
      const userId = req.query.userId;

      // console.log("User ID: ", userId); // Debugging statement to check the extracted user ID
      const user = await UserModel.findById(userId);
      if (!user) 
      {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({
        id: user._id,
        name: user.name,
        username: user.username,
        cash: user.cash,
        itemsOwned: user.itemsOwned,
        
      });
    } 
    catch (error) 
    {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
// Endpoint to fetch trades made by the user
router.get('/user-trades', async (req, res) => {
    // console.log("REQUEST PARAMS User-Trades: ", req.query); // Debugging statement to check the request parameters
    try 
    {
        const userId = req.query.userId;
        // Find the trade which has reference to creator
        
        const trades = await TradeModel.find({ creator: userId });
        

        // console.log("Trades: ", trades); // Debugging statement to check the extracted trades

        res.json({ trades });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
    });
    

    // Route to fetch offers for a specific trade
router.get('/offer-info', async (req, res) => {
    // console.log("REQUEST PARAMS: ", req.query); // Debugging statement to check the request parameters
    const { tradeId , userId , creatorName} = req.query;

    // console.log("Trade ID: ", tradeId); // Debugging statement to check the extracted trade ID
    // console.log("User ID xd: ", userId); // Debugging statement to check the extracted user ID
    // console.log("Creatorname:", creatorName)

    try 
    {
      // get the trade by id
      const trade = await TradeModel.findById(tradeId);
      // console.log("Trade: ", trade); // Debugging statement to check the extracted trade

      // get the offer IDs from the trade
      const offersIDs = trade.offers;

      // get all the offers from the offer IDs
      const offers = await OfferModel.find({ _id: { $in: offersIDs } , status: 'Pending'});
      
      // console.log("Offers Found: ", offers); // Debugging statement to check the extracted offers

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


// Route to accept an offer
router.put('/accept/:offerId', async (req, res) => {
  try 
  {
      // console.log("Backend - Accept Offer")
      const { offerId } = req.params;

      // console.log("Offer ID: ", offerId); // Debugging statement to check the extracted offer ID
      const offer = await OfferModel.findByIdAndUpdate(offerId, { status: 'Accepted' });

      if (!offer) 
      {
          return res.status(404).json({ success: false, message: 'Offer not found' });
      }

      // Update the trade with the accepted offer
      //first i need the trade id from offer object

      const stored_offer = await OfferModel.findById(offerId)
      const tradeId = stored_offer.offerForItem

      const trade = await TradeModel.findById(tradeId);
      trade.acceptedOffer = offerId;

      trade.status = 'Closed';

      await trade.save();

      const offering_user = await UserModel.findById(stored_offer.creator)

      const receiving_user = await UserModel.findById(trade.creator)

      console.log("Offering User: ", offering_user)
      console.log("Receiving User: ", receiving_user)

      // Update the cash and items of the offering user
      offering_user.cash = offering_user.cash - stored_offer.cashOffered
      offering_user.itemsOwned = offering_user.itemsOwned - stored_offer.itemsOffered


      await offering_user.save()

      // Update the cash and items of the receiving user
      receiving_user.cash = receiving_user.cash + stored_offer.cashOffered
      receiving_user.itemsOwned = receiving_user.itemsOwned + stored_offer.itemsOffered

      await receiving_user.save()



      res.json({ success: true, message: 'Offer accepted', offer });
  } 
  catch (error) 
  {
      console.error("Error accepting offer:", error);
      res.status(500).json({ success: false, message: 'Error accepting offer' });
  }
});

// Route to reject an offer
router.put('/reject/:offerId', async (req, res) => {
  try 
  {
      const { offerId } = req.params;
      const offer = await OfferModel.findByIdAndUpdate(offerId, { status: 'Rejected' });

      if (!offer) 
      {
          return res.status(404).json({ success: false, message: 'Offer not found' });
      }

      res.json({ success: true, message: 'Offer rejected', offer });
  } 
  catch (error) 
  {
      console.error("Error rejecting offer:", error);
      res.status(500).json({ success: false, message: 'Error rejecting offer' });
  }
});



export { router };