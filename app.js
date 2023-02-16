import express from 'express';
import { title } from 'process';
import { getBollingerBands } from './services/bollinger-Bander.js';
import cors from 'cors'

const app = express();
app.set('view engine', 'ejs')

app.use(cors({
}));

// EJS als View-Engine verwenden
app.set('view engine', 'ejs');

const bollingerBandsObj = {
    name: "BollingerBands",
    upperBand: 0,
    lowerBand: 0,
    currentPrice: 0,
    bandDistance: 0,
    bandRatio: 0
};

// GET-Endpunkt, der die Objekte im JSON-Format zurückgibt
app.get('/bb', async (req, res) => {
    await getBollingerBands().then(res => {
        bollingerBandsObj.name = res.name
        bollingerBandsObj.currentPrice = res.currentPrice
        bollingerBandsObj.upperBand = res.upperBand
        bollingerBandsObj.lowerBand = res.lowerBand
        bollingerBandsObj.bandDistance = res.bandDistance
        bollingerBandsObj.bandRatio = res.bandRatio
    })


    res.render("index", {
        name: bollingerBandsObj.name,
        currentPrice: bollingerBandsObj.currentPrice,
        upperband: bollingerBandsObj.upperBand,
        lowerBand: bollingerBandsObj.lowerBand,
        bandDistance: bollingerBandsObj.bandDistance,
        bandRatio: bollingerBandsObj.bandRatio
    })
    //  res.json(await getBollingerBands());


});

// Starte den Server auf Port 3000
app.listen(3000, () => {
    console.log('Server gestartet auf Port 3000');
});
