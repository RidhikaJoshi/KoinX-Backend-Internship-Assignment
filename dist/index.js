"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = require("./utils/ApiError");
const ApiResponse_1 = require("./utils/ApiResponse");
const asyncHandler_1 = require("./utils/asyncHandler");
const bitcoin_model_1 = require("./models/bitcoin.model");
const matic_network_model_1 = require("./models/matic-network.model");
const ethereum_model_1 = require("./models/ethereum.model");
const dotenv_1 = __importDefault(require("dotenv"));
const index_js_1 = __importDefault(require("./db/index.js"));
//import cron from 'node-cron';
dotenv_1.default.config();
(0, index_js_1.default)()
    .then(() => {
    app.on("error", (error) => {
        // using arrow function to catch error occured in connecting express and database
        console.log("Error occured in server", error);
        throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
    .catch((err) => {
    console.log("Error occured in connecting to database", err);
});
const app = (0, express_1.default)();
// Task 1
// Implement a background job that will fetch the current price in USD,
//  market cap in USD and 24 hour change of 3 cryptocurrencies: Bitcoin, Matic, and Ethereum and store it in a database. 
// This job should run once every 2 hours.
app.get('/', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cmatic-network&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false', {
        headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY }
    });
    console.log(response.data);
    // Adding data into the mongodb database
    const bitcoin = yield bitcoin_model_1.Bitcoin.create({
        curr_price: response.data.bitcoin.usd,
        market_cap: response.data.bitcoin.usd_market_cap,
        change_24h: response.data.bitcoin.usd_24h_change
    });
    if (!bitcoin) {
        res
            .status(400)
            .json(new ApiError_1.ApiError(400, "Error in saving data"));
        return;
    }
    const ethereum = yield ethereum_model_1.Ethereum.create({
        curr_price: response.data.ethereum.usd,
        market_cap: response.data.ethereum.usd_market_cap,
        change_24h: response.data.ethereum.usd_24h_change
    });
    if (!ethereum) {
        res
            .status(400)
            .json(new ApiError_1.ApiError(400, "Error in saving data"));
        return;
    }
    const matic = yield matic_network_model_1.Matic_Network.create({
        curr_price: response.data["matic-network"].usd,
        market_cap: response.data["matic-network"].usd_market_cap,
        change_24h: response.data["matic-network"].usd_24h_change
    });
    if (!matic) {
        res
            .status(400)
            .json(new ApiError_1.ApiError(400, "Error in saving data"));
        return;
    }
    // console.log("Bitcoin",bitcoin);
    // console.log("Ethereum",ethereum);
    // console.log("Matic",matic);
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "Data Fetched successfully", response.data));
})));
// Task 2
// Implement an API /stats, that will return the latest data about the requested cryptocurrency.
// Query params:
// {
// 	coin: `bitcoin` // Could be one of the bitcoin, matic-network and ethereum.
// }
// ​
// Sample Response:
// {
// 	price: 40000,
// 	marketCap: 800000000,
app.get('/stats', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coin = req.query.coin;
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
        res
            .status(400)
            .json(new ApiError_1.ApiError(400, 'Invalid coin name'));
        return;
    }
    const response = yield axios_1.default.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false`, {
        headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY }
    });
    //console.log(response.data);
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "Data Fetched successfully", response.data));
})));
// Task 3
// Implement an API, /deviation, that will return the standard deviation of the price of the requested cryptocurrency for the last 100 records stored by the background service in the database.
// For example, consider the database only has 3 records for bitcoin, each with a price of 40000, 45000, 50000 respectively. Then the result should return 4082.48.
// Query params:
// {
// 	coin: `bitcoin` // Could be one of the above 3 coins
// }
// ​
// Sample Response:
// {
// 	deviation: 4082.48
// }
app.get('/deviation', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coin = req.query.coin;
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
        res
            .status(400)
            .json(new ApiError_1.ApiError(400, 'Invalid coin name'));
        return;
    }
    let data = [];
    if (coin === 'bitcoin') {
        data = yield bitcoin_model_1.Bitcoin.find().sort({ createdAt: -1 }).limit(100);
    }
    else if (coin === 'ethereum') {
        data = yield ethereum_model_1.Ethereum.find().sort({ createdAt: -1 }).limit(100);
    }
    else if (coin === 'matic-network') {
        data = yield matic_network_model_1.Matic_Network.find().sort({ createdAt: -1 }).limit(100);
    }
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].curr_price;
    }
    const mean = sum / data.length; // calculating mean
    let sumOfSquares = 0;
    for (let i = 0; i < data.length; i++) {
        sumOfSquares += Math.pow(data[i].curr_price - mean, 2);
    }
    const deviation = Math.sqrt(sumOfSquares / (data.length - 1));
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "Data Fetched successfully", deviation.toString()));
})));
