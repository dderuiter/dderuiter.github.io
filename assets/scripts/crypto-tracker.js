var context = {}; // Namespace for the file

(function() {

    var holdings = {};
    var totalCost = 5750;
    var totalValue = 0;

    // Order: LNS + BINANCE
    // Total Cost in USD
    var purchases =
        { "ETH":  new Purchase(1.43680044 + 0.37897014, 966.73),
          "LTC":  new Purchase(2.25763414, 770.65538628716649),
          "OMG":  new Purchase(10, 120.70),
          "IOT":  new Purchase(50, 163.94),
          "SALT": new Purchase(60, 522.94),
          "EOS":  new Purchase(70, 548.80),
          "XLM":  new Purchase(100, 20.12),
          "ADA":  new Purchase(100, 38.31),
          "FUN":  new Purchase(1000, 44.56),
          "XVG":  new Purchase(2000, 326.65),
          "XRP":  new Purchase(786.85 + 1533.27, 2422.82),
          "TRX":  new Purchase(3000, 129.05) };

    this.processPurchases = function() {
        var symbols = "";
        $.each(purchases, function(symbol, purchase) {
            symbols += symbol + ",";
            var holding = new Holding();
            holding.coin.symbol = symbol;
            holding.quantity = purchase.quantity;
            holding.totalCost = purchase.totalCost;
            holding.costPerCoin = purchase.totalCost / purchase.quantity;
            holdings[symbol] = holding;

        });
        // Remove last comma
        return symbols.substring(0, symbols.length - 1);
    };

    this.getConversionRateBTCtoUSD = function() {
        var restURL = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USDT&e=Binance';
        console.log("URL: " + restURL);

        return $.ajax({
            url: restURL,
            dataType: 'json',
            type: 'GET',
        });
    };

    function getGeneralData() {
        var restURL = 'https://min-api.cryptocompare.com/data/all/coinlist';
        console.log("URL: " + restURL);

        return $.ajax({
            url: restURL,
            dataType: 'json',
            type: 'GET'
        });
    }

    function getHourData(symbol) {
        var restURL = 'https://min-api.cryptocompare.com/data/histohour?fsym=' + symbol + '&tsym=BTC&limit=24&aggregate=1&e=Binance';
        console.log("URL: " + restURL);

        return $.ajax({
            url: restURL,
            dataType: 'json',
            type: 'GET',
            success: function(response) {
                response.symbol = symbol;
            }
        });
    };

    function getDayData(symbols) {
        var restURL = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + symbols + '&tsyms=BTC&e=Binance';
        console.log("URL: " + restURL);

        return $.ajax({
            url: restURL,
            dataType: 'json',
            type: 'GET'
        });
    };

    this.populateHoldingsData = function(conversionRate, symbols) {
        // Get general coin data
        var generalDataRetrieved = getGeneralData();

        // Get coin data for past day
        var dayDataRetrieved = getDayData(symbols);

        // Get coin data for past hour
        var symbolArr = symbols.split(",");
        var hourDataRetrieved = [];
        $.each(symbolArr, function() {
            hourDataRetrieved.push(getHourData(this));
        });

        return $.when(generalDataRetrieved, dayDataRetrieved, ...hourDataRetrieved)
            .done(function(generalData, dayData) {
                // Store general coin info
                var baseImageURL = generalData[0].BaseImageUrl;
                $.each(holdings, function() {
                    var holding = this;
                    var coinData = generalData[0].Data[holding.coin.symbol];
                    holding.coin.imageURL = baseImageURL + coinData.ImageUrl;
                    holding.coin.name = coinData.CoinName;
                });

                // Store past day data
                $.each(dayData[0].RAW, function(key, value) {
                    $.each(value, function() {
                        var holding = holdings[this.FROMSYMBOL];
                        var coin = holding.coin;

                        coin.price = this.PRICE * conversionRate;

                        holding.dayPriceLow = this.LOW24HOUR * conversionRate;
                        holding.dayPriceHigh = this.HIGH24HOUR * conversionRate;
                        holding.dayPriceChange = holding.dayPriceHigh - holding.dayPriceLow;
                        holding.dayPercentChange = holding.dayPriceChange / holding.dayPriceLow * 100;

                        holding.value = coin.price * holding.quantity;
                        holding.net = holding.value - holding.totalCost;

                        totalValue += holding.value;
                    });
                });

                // Store past hour data
                $.each(hourDataRetrieved, function() {
                    var responseJSON = this.responseJSON;
                    var pastHourData = responseJSON.Data[24];
                    var holding = holdings[responseJSON.symbol];

                    holding.hourPriceLow = pastHourData.low * conversionRate;
                    holding.hourPriceHigh = pastHourData.high * conversionRate;
                    holding.hourPriceChange = holding.hourPriceHigh - holding.hourPriceLow;
                    holding.hourPercentChange = holding.hourPriceChange /  holding.hourPriceLow * 100;
                });
            });
    };

    this.updateUI = function(table) {
        console.log(holdings);

        // Update holdings
        $.each(holdings, function() {
            var holding = this;
            table.row
                .add([
                    holding.coin.name,
                    holding.coin.symbol,
                    holding.quantity,
                    "$" + holding.coin.price.toFixed(4),
                    "$" + holding.hourPriceLow.toFixed(4),
                    "$" + holding.hourPriceHigh.toFixed(4),
                    "$" + holding.hourPriceChange.toFixed(4),
                    holding.hourPercentChange.toFixed(2) + "%",
                    "$" + holding.dayPriceLow.toFixed(4),
                    "$" + holding.dayPriceHigh.toFixed(4),
                    "$" + holding.dayPriceChange.toFixed(4),
                    holding.dayPercentChange.toFixed(2) + "%",
                    "$" + holding.costPerCoin.toFixed(2),
                    "$" + holding.value.toFixed(2),
                    "$" + holding.net.toFixed(2)])
                .draw();
        });

        // Color and align cells
        const totalColumns = 15;
        var colIndex = 0;
        $("#table-holdings tbody tr td").each(function() {
            colIndex = colIndex % totalColumns;
            if(colIndex === 6 || colIndex === 7 || colIndex === 10 || colIndex === 11 || colIndex === 14) {
                var text = this.innerHTML;
                var number = text.replace("$", "");
                var value = parseFloat(number);
                colorPosNeg(this, value);
            }
            if(colIndex !== 0 && colIndex !== 1 && colIndex !== 2) {
                $(this).css("text-align", "right");
            }
            colIndex++;
        });

        // Update totals
        $("#portfolio-value").html("Portfolio Value = $" + totalValue.toFixed(2));
        $("#portfolio-cost").html("Portfolio Cost = $" + totalCost.toFixed(2));
        $("#portfolio-net").html("Portfolio Net = $" + (totalValue - totalCost).toFixed(2));
    };

    function colorPosNeg(domElement, value) {
        // Positive
        if(value > 0) {
            $(domElement).addClass("positive");
        }
        // Negative
        else if(value < 0) {
            $(domElement).addClass("negative");
        }
        else {
            // Do nothing (i.e. leave white)
        }
    }

}).apply(context);

$(document).ready(function() {
    var symbols = context.processPurchases();

    // Create DataTable
    var table = $("#table-holdings").DataTable({
        paging: false,
        scrollX: true
    });

    $.when(context.getConversionRateBTCtoUSD())
        .then(function(response) {
            var conversionRate = response.USDT;
            return context.populateHoldingsData(conversionRate, symbols)
        })
        .then(function() {
            context.updateUI(table);
        });
});
