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
const app = (0, express_1.default)();
// Task 1
// Implement a background job that will fetch the current price in USD,
//  market cap in USD and 24 hour change of 3 cryptocurrencies: Bitcoin, Matic, and Ethereum and store it in a database. 
// This job should run once every 2 hours.
app.get('/', (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cmatic-network&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false', {
        headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY }
    });
    //console.log(response.data);
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
app.get('/stats', (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
