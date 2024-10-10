"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitcoin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bitcoinSchema = new mongoose_1.default.Schema({
    // curr_price, market_cap, change_24h
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
exports.Bitcoin = mongoose_1.default.model('Bitcoin', bitcoinSchema);
