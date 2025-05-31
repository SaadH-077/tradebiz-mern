import mongoose from "mongoose";

const Schema = mongoose.Schema;

const offerSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId, // Reference to the user who created the trade
        ref: 'User',
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    offerForItem: {
        type: Schema.Types.ObjectId, // Reference to the item being offered for
        ref: 'Trade',
        required: true
    },
    // description: {
    //     type: String,
    //     required: true
    // },
    // conditions: [{
    //     type: String // Array of strings for trade conditions
    // }],
    itemsOffered: {
        type: Number,
    },
    cashOffered: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

const OfferModel = mongoose.model('Offer', offerSchema);

export default OfferModel;
