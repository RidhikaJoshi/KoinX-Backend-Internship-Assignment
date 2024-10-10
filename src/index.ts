import express, { Request, Response } from 'express'
import axios from 'axios'
import { ApiError } from "./utils/ApiError";
import { ApiResponse } from "./utils/ApiResponse";
import { asyncHandler } from "./utils/asyncHandler";


const app = express();


// Task 1
// Implement a background job that will fetch the current price in USD,
//  market cap in USD and 24 hour change of 3 cryptocurrencies: Bitcoin, Matic, and Ethereum and store it in a database. 
// This job should run once every 2 hours.

app.get('/',asyncHandler(async (req:Request,res:Response,next:express.NextFunction)=>{

       const response=await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cmatic-network&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false',
        {
            headers: {accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY}
        });
       //console.log(response.data);
        res
       .status(200)
       .json(new ApiResponse(200,"Data Fetched successfully",response.data));
  
}));

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
app.get('/stats', asyncHandler(async (req:Request,res:Response,next:express.NextFunction)=>{

        const coin=req.query.coin;
        if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin as string)) {
             res
            .status(400)
            .json(new ApiError(400, 'Invalid coin name'));
            return;
        }
        const response=await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false`,
        {
            headers: {accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY}
        });
        //console.log(response.data);
        res
        .status(200)
        .json(new ApiResponse(200,"Data Fetched successfully",response.data));
    
}));


app.listen(8000,()=>{
    console.log('Server is running on port 8000');
});