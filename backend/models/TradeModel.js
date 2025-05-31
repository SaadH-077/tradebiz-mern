import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    conditions: [{
        type: String // Array of strings for trade conditions
    }],
    offers: [{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    }],
    acceptedOffer: {
        type: Schema.Types.ObjectId, // Reference to the accepted offer
        ref: 'Offer',
        default: null
    },
    creator: {
        type: Schema.Types.ObjectId, // Reference to the user who created the trade
        ref: 'User',
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    status: {
        type: String, // Status of the trade
        enum: ['Open', 'Closed'],
        default: 'Open'
    }
}, { timestamps: true });

const TradeModel = mongoose.model('Trade', tradeSchema);

export default TradeModel;
