import { get } from 'axios';

const get20DayClosingPrices = async () => {
    const symbol = 'XRPUSDT';
    const interval = '1d';
    const limit = 20;

    try {
        const response = await get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
        const closingPrices = response.data.map(item => parseFloat(item[4]));
        return closingPrices;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getCurrentPrice = async () => {
    const symbol = 'XRPUSDT';

    try {
        const response = await get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        const currentPrice = parseFloat(response.data.price);
        return currentPrice;
    } catch (error) {
        console.error(error);
        return null;
    }
}

Promise.all([get20DayClosingPrices(), getCurrentPrice()]).then(([closingPrices, currentPrice]) => {
    if (closingPrices !== null && currentPrice !== null) {
        const averageClosingPrice = closingPrices.reduce((sum, price) => sum + price, 0) / closingPrices.length;
        const priceDifference = currentPrice - averageClosingPrice;
        console.log(`The current price of XRP is ${currentPrice}`);
        console.log(`The average closing price for the last 200 days is ${averageClosingPrice}`);
        console.log(`The current price is ${priceDifference > 0 ? 'above' : 'below'} the average by ${Math.abs(priceDifference)}`);
    } else {
        console.log('Failed to get closing prices or current price');
    }
});
