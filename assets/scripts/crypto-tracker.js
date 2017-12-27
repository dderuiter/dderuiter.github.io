var context = {}; // Namespace for the file

(function() {

    var holdings = [];
    var totalCost = 5750;
    var purchases = { "BTC":  new Purchase("BTC", 0.0172),
                      "LTC":  new Purchase("LTC", 4.19623414),
                      "ETH":  new Purchase("ETH", 1.43680044),
                      "TRX":  new Purchase("TRX", 3000),
                      "XRP":  new Purchase("XRP", 2340.12),
                      "FUN":  new Purchase("FUN", 1000),
                      "XLM":  new Purchase("XLM", 100),
                      "ADA":  new Purchase("ADA", 100),
                      "EOS":  new Purchase("EOS", 70),
                      "SALT": new Purchase("SALT", 53.5),
                      "IOTA": new Purchase("IOTA", 50),
                      "OMG":  new Purchase("OMG", 10)};

    function updateHoldings(conversionRate) {
        var symbols = getPurchaseSymbols();

        $.ajax({
            url: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + symbols + '&tsyms=BTC&e=Binance',
            dataType: 'json',
            type: 'GET',
            success: function (response) {
                console.log(response);
                var totalValue = 0;
                // Loop through each JSON object
                $.each(response.RAW, function(k, v) {
                    $.each(v, function() {
                        var coin = new Coin(this.FROMSYMBOL, this.PRICE * conversionRate, this.CHANGE24HOUR * conversionRate, this.CHANGEPCT24HOUR);
                        var purchase = purchases[coin.symbol];
                        var quantity = purchase.quantity;
                        var holding = new Holding(coin, quantity);

                        holdings.push(holding);

                        totalValue += holding.value;
                        console.log(totalValue);
                    });
                });

                addBTC(conversionRate, totalValue);
            }
        });
    };

    function getPurchaseSymbols() {
        var symbols = "";
        $.each(purchases, function() {
            symbols += this.symbol + ",";
        });
        // Skip BTC
        return symbols.substring(4, symbols.length - 1);
    };

    function addBTC(conversionRate, totalValue) {
        $.ajax({
            url: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USDT&e=Binance',
            dataType: 'json',
            type: 'GET',
            success: function (response) {
                // Loop through each JSON object
                $.each(response.RAW, function(k, v) {
                    $.each(v, function() {
                        var coin = new Coin(this.FROMSYMBOL, this.PRICE, this.CHANGE24HOUR, this.CHANGEPCT24HOUR);
                        var purchase = purchases[coin.symbol];
                        var quantity = purchase.quantity;
                        var holding = new Holding(coin, quantity);

                        holdings.unshift(holding);

                        totalValue += holding.value;
                    });
                });

                console.log(holdings);
                updateUI(totalValue);
            }
        });
    }

    function updateUI(totalValue) {
        // Update holdings
        var tBody = $("#holdings").find("tbody");
        $.each(holdings, function() {
            tBody.append($('<tr>'));
            var lastRow = $("#holdings").find('tbody:last');
            lastRow.append($('<td>').text(this.coin.symbol));
            lastRow.append($('<td>').text(this.coin.price.toFixed(4)));
            lastRow.append($('<td>').text(this.coin.dayPriceChange.toFixed(4)));
            lastRow.append($('<td>').text(this.coin.dayPercentChange.toFixed(2)));
            lastRow.append($('<td>').text(this.quantity));
            lastRow.append($('<td>').text(this.value.toFixed(2)));
        });

        // Update total Value
        $("#portfolio-value").html("Portfolio Value = $" + totalValue.toFixed(2));
        $("#portfolio-cost").html("Portfolio Cost = $" + totalCost.toFixed(2));
        $("#portfolio-net").html("Portfolio Net = $" + (totalValue - totalCost).toFixed(2));
    };

    this.getConversionRateBTCtoUSD = function() {
        $.ajax({
            url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USDT&e=Binance',
            dataType: 'json',
            type: 'GET',
            success: function (response) {
                updateHoldings(response.USDT);
            }
        });
    };

}).apply(context);

$(document).ready(function() {
    context.getConversionRateBTCtoUSD();
});
