import express, { Request, Response } from 'express'
import axios from 'axios'
import { ApiError } from "./utils/ApiError";
import { ApiResponse } from "./utils/ApiResponse";
import { asyncHandler } from "./utils/asyncHandler";
import { Bitcoin } from "./models/bitcoin.model";
import { Matic_Network } from "./models/matic-network.model";
import { Ethereum } from "./models/ethereum.model";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cron from 'node-cron';

dotenv.config();

connectDB() // connecting to the database
  .then(() => {
    app.on("error", (error) => {
      // using arrow function to catch error occured in connecting express and database
      console.log("Error occured in server", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
        // listening to the port
      console.log(`Server is running on port ${process.env.PORT}`);
      startCryptoDataJob(); // starting the job to fetch data
      console.log("Job started successfully");
    });
  })
  .catch((err) => {
    // catching error occured in connecting to database
    console.log("Error occured in connecting to database", err);
  });


const app = express();


app.get("/", (req: Request, res: Response) => {
    // sending response
    res.status(200).json("Server is running!  Use /stats or /deviation to get the data");
  }
);
// Task 1
// Implement a background job that will fetch the current price in USD,
//  market cap in USD and 24 hour change of 3 cryptocurrencies: Bitcoin, Matic, and Ethereum and store it in a database. 
// This job should run once every 2 hours.

 async function fetchCryptoData()  {
    // fetching data from the api
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cmatic-network&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false', {
            headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY }
        });

        // Adding data into the mongodb database
        const bitcoin = await Bitcoin.create({
            curr_price: response.data.bitcoin.usd,
            market_cap: response.data.bitcoin.usd_market_cap,
            change_24h: response.data.bitcoin.usd_24h_change
        });
        bitcoin.save();
        const ethereum = await Ethereum.create({
            curr_price: response.data.ethereum.usd,
            market_cap: response.data.ethereum.usd_market_cap,
            change_24h: response.data.ethereum.usd_24h_change
        });
        ethereum.save();
        const matic = await Matic_Network.create({
            curr_price: response.data["matic-network"].usd,
            market_cap: response.data["matic-network"].usd_market_cap,
            change_24h: response.data["matic-network"].usd_24h_change
        });
        matic.save();
        console.log("Data fetched and stored successfully");
    } catch (error) {
        console.error("Error in fetching or storing data", error);
    }
};

export function startCryptoDataJob() {
    cron.schedule('0 */2 * * *', async () => {
      console.log('Running cryptocurrency data fetch job');
      await fetchCryptoData();
    });
  
    fetchCryptoData();
  }


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



app.get('/stats', asyncHandler(async (req:Request,res:Response)=>{
    // checking if the coin name is valid or not
    const coin=req.query.coin;
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin as string)) {
            res
        .status(400)
        .json(new ApiError(400, 'Invalid coin name'));
        return;
    }
    // fetching data from the database
    const response=await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false`,
    {
        headers: {accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY}
    });
    //console.log(response.data);
    res
    .status(200)
    .json(new ApiResponse(200,"Data Fetched successfully",response.data));

}));



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

app.get('/deviation', asyncHandler(async (req:Request,res:Response)=>{
    // checking if the coin name is valid or not
    const coin=req.query.coin;
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin as string)) {
            res
        .status(400)
        .json(new ApiError(400, 'Invalid coin name'));
        return;
    }
    // fetching data from the database
    let data: any[] = [];
    if(coin==='bitcoin'){
        data=await Bitcoin.find().sort({createdAt: -1}).limit(100);
    }
    else if(coin==='ethereum'){
        data=await Ethereum.find().sort({createdAt: -1}).limit(100);
    }
    else if(coin==='matic-network'){
        data=await Matic_Network.find().sort({createdAt: -1}).limit(100);
    }
    // calculating standard deviation
    let sum=0;
    for(let i=0;i<data.length;i++){
        sum+=data[i].curr_price;
    }
    const mean=sum/data.length; // calculating mean
    let sumOfSquares=0;
    for(let i=0;i<data.length;i++){
        sumOfSquares+=Math.pow(data[i].curr_price-mean,2); // calculating sum of squares
    }
    const deviation=Math.sqrt(sumOfSquares/(data.length - 1)); // calculating standard deviation
    res // sending response
    .status(200)
    .json(new ApiResponse(200,"Data Fetched successfully", deviation.toString()));

}));