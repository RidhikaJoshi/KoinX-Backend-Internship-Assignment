import mongoose from "mongoose";


const ethereumSchema = new mongoose.Schema({
    curr_price: {
        type: Number,
        required: true
    },
    market_cap: {
        type: Number,
        required: true
    },
    change_24h: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const Ethereum = mongoose.model('Ethereum', ethereumSchema);