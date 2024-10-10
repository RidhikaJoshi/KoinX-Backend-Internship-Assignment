import mongoose from "mongoose";


const matic_networkSchema = new mongoose.Schema({
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

export const Matic_Network = mongoose.model('Matic_Network', matic_networkSchema);