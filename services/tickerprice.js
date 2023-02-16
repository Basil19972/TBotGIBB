import axios from 'axios';

function getLatestXrpPrice() {
    const binanceApiUrl = 'https://api.binance.com/api/v3/ticker/price';
    const symbol = 'XRPUSDT';
    const requestUrl = `${binanceApiUrl}?symbol=${symbol}`;

    get(requestUrl)
        .then(response => {
            const price = parseFloat(response.data.price);
            console.log(`Aktueller XRP-Preis: ${price} USDT`);
        })
        .catch(error => {
            console.error(`Fehler beim Abrufen des XRP-Preises: ${error}`);
        });
}

setInterval(getLatestXrpPrice, 1000); // alle 10 Sekunden ausführen
