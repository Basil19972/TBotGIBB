/*
Dieser Code ruft die Schlusskurse der letzten 20 Tage des XRPUSD-Vermögenswerts ab, 
berechnet den gleitenden Durchschnitt und die Standardabweichung und verwendet sie, um 
die Bollinger-Bänder zu berechnen. Dann wird der aktuelle Preis abgerufen und mit den Bollinger-Bändern verglichen, 
indem das Verhältnis zwischen dem aktuellen Preis und dem Abstand zwischen dem aktuellen Preis und dem gleitenden 
Durchschnitt berechnet wird. Ein hoher Wert dieses Verhältnisses deutet darauf hin, dass der Vermögenswert überkauft 
ist, während ein niedriger Wert darauf hinweist, dass der Vermögenswert überverkauft ist.

Bollinger-Bänder sind ein technischer Indikator, der von John Bollinger entwickelt wurde 
und häufig in der technischen Analyse von Finanzmärkten verwendet wird. Die Bänder bestehen aus 
drei Linien, die um einen gleitenden Durchschnitt herum gezeichnet werden. 
Der mittlere Linie ist der gleitende Durchschnitt, der normalerweise über 20 Perioden berechnet wird. 
Die oberen und unteren Linien, auch als "Bänder" bezeichnet, werden normalerweise zwei Standardabweichungen 
vom gleitenden Durchschnitt entfernt platziert.

Die Breite der Bollinger-Bänder wird durch die Volatilität des Vermögenswerts bestimmt. 
Wenn die Volatilität hoch ist, werden die Bänder weiter auseinander liegen, während sie sich bei geringerer Volatilität verengen. 
Die Bänder dienen als Indikator für die Höhe oder Niedrigkeit des aktuellen Preises im Verhältnis zu den historischen Preisen. 
Wenn der Preis nahe dem oberen Band liegt, wird angenommen, dass der Markt überkauft ist und ein Rückgang bevorstehen könnte. 
Wenn der Preis nahe dem unteren Band liegt, wird angenommen, dass der Markt überverkauft ist und eine Rally bevorstehen könnte.
*/




import axios from 'axios';

const get20DayClosingPrices = async () => {
    const symbol = 'XRPUSDT';
    const interval = '1d';
    const limit = 20;

    try {
        const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
        const closingPrices = response.data.map(item => parseFloat(item[4]));
        return closingPrices;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getStandardDeviation = (values) => {
    const avg = getAverage(values);

    const squareDiffs = values.map(value => Math.pow(value - avg, 2));

    const avgSquareDiff = getAverage(squareDiffs);

    const stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

const getAverage = (values) => {
    const sum = values.reduce((total, value) => total + value, 0);
    const avg = sum / values.length;
    return avg;
}

export const getBollingerBands = async () => {
    const closingPrices = await get20DayClosingPrices();

    if (closingPrices !== null) {
        const averageClosingPrice = getAverage(closingPrices);
        const standardDeviation = getStandardDeviation(closingPrices);

        const upperBand = averageClosingPrice + (2 * standardDeviation);
        const lowerBand = averageClosingPrice - (2 * standardDeviation);

        const currentPriceResponse = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=XRPUSDT');
        const currentPrice = parseFloat(currentPriceResponse.data.price);

        const bandDistance = currentPrice - averageClosingPrice;
        const bandRatio = bandDistance / standardDeviation;
        /*
                console.log(`Upper Bollinger Band: ${upperBand}`);
                console.log(`Lower Bollinger Band: ${lowerBand}`);
                console.log(`Current price: ${currentPrice}`);
                console.log(`Band distance: ${bandDistance}`);
                console.log(`Band ratio: ${bandRatio}`);
                */

        const bollingerBandsObj = {
            name: "BollingerBands",
            upperBand: upperBand,
            lowerBand: lowerBand,
            currentPrice: currentPrice,
            bandDistance: bandDistance,
            bandRatio: bandRatio
        };

        return bollingerBandsObj

    } else {
        console.log('Failed to get closing prices');
    }
}

/*  Upper Bollinger Band: Der obere Bollinger-Band-Wert gibt den Wert an, bei dem sich das obere Band befindet. Es wird normalerweise durch Hinzufügen von zwei Standardabweichungen zum gleitenden Durchschnitt berechnet.

    Lower Bollinger Band: Der untere Bollinger-Band-Wert gibt den Wert an, bei dem sich das untere Band befindet. Es wird normalerweise durch Subtrahieren von zwei Standardabweichungen vom gleitenden Durchschnitt berechnet.

    Current price: Der aktuelle Preis gibt den aktuellen Marktpreis des Vermögenswerts an.

    Band distance: Die Band-Distanz gibt den Abstand zwischen dem aktuellen Preis und dem nächsten Bollinger-Band an.

    Band ratio: Das Band-Verhältnis gibt den Prozentsatz des Bandabstands zum gleitenden Durchschnitt an. Es wird normalerweise verwendet, um die Volatilität des Vermögenswerts zu messen. */
