import express, { Request, Response } from 'express'
import axios from 'axios'


const app = express();


// Task 1
// Implement a background job that will fetch the current price in USD,
//  market cap in USD and 24 hour change of 3 cryptocurrencies: Bitcoin, Matic, and Ethereum and store it in a database. 
// This job should run once every 2 hours.

app.get('/',async (req:Request,res:Response)=>{
   const response=await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cmatic-network&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false',
    {
        headers: {accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY}

    });
   //console.log(response.data);
    res
   .status(200)
   .json({
        status:200,
        message:"Fetched successfully",
        data:response.data
    });
});

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
// 	"24hChange": 3.4
// }

app.get('/stats',async (req:Request,res:Response)=>{
    const coin=req.query.coin;
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin as string)) {
        res
        .status(400)
        .json({
            status:400,
            message:"Please provide coin name"
        });
    }
    const response=await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false`,
    {
        headers: {accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY}

    });
    //console.log(response.data);
    res
    .status(200)
    .json({
        status:200,
        message:"Data Fetched successfully",
        data:response.data
    });
});


app.listen(8000,()=>{
    console.log('Server is running on port 8000');
});