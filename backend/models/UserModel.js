import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the structure for user data in MongoDB
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true // Ensuring username is unique
    },
    password: {
        type: String,
        required: true
    },
    tradesCreated: [{
        type: Schema.Types.ObjectId,
        ref: 'Trade'
    }],
    itemsOwned: {
        type: Number,
        default: 10
    },
    cash: {
        type: Number,
        default: 1000
    },
    email: {
        type: String, // Added email for account recovery and notifications
        required: true,
        unique: true
    }
}, { timestamps: true }); // Enable automatic tracking of creation and modification times

const UserModel = mongoose.model('User', userSchema);

export default UserModel;