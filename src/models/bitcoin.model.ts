import mongoose from "mongoose";


const bitcoinSchema = new mongoose.Schema({
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

export const Bitcoin = mongoose.model('Bitcoin', bitcoinSchema);