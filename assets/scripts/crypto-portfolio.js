var context = {}; // Namespace for the file

(function() {

    var holdings = {};
    var totalCost = 7000;
    var totalValue = 0;

    // Order: LNS + BINANCE
    // Total Cost in USD
    var purchases =
        { "LTC":  new Purchase(0.59375420, 146.54),
          "OMG":  new Purchase(10, 120.70),
          "IOT":  new Purchase(50, 163.94),
          "EOS":  new Purchase(30, 235.2),
          "SALT": new Purchase(125, 1418.93),
          "XLM":  new Purchase(100, 20.12),
          "FUN":  new Purchase(1000, 44.56),
          "ADA":  new Purchase(1250.388, 884.94),
          "XRP":  new Purchase(3089.07, 3750.32),
          "XVG":  new Purchase(3398.60, 615.68),
          "RDD":  new Purchase(0, 0)};

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

        return $.ajax({
            url: restURL,
            dataType: 'json',
            type: 'GET',
        });
    };

    function getGeneralData() {
        var restURL = 'https://min-api.cryptocompare.com/data/all/coinlist';

        return $.ajax({
            url: restURL,
            dataType: 'json',
            type: 'GET'
        });
    }

    function getHourData(symbol) {
        var restURL = 'https://min-api.cryptocompare.com/data/histohour?fsym=' + symbol + '&tsym=BTC&limit=24&aggregate=1&e=Binance';

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

        return $.ajax({
            url: restURL,
            dataType: 'json',
            type: 'GET'
        });
    };

    function getPriceData(symbol) {
        var restURL = 'https://min-api.cryptocompare.com/data/price?fsym=' + symbol + '&tsyms=BTC';

        return $.ajax({
            url: restURL,
            dataType: 'json',
            type: 'GET',
            success: function(response) {
                response.symbol = symbol;
            }
        });
    }

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

                    if(pastHourData) {
                        if(pastHourData.low) {
                            holding.hourPriceLow = pastHourData.low * conversionRate;
                        }
                        if(pastHourData.high) {
                            holding.hourPriceHigh = pastHourData.high * conversionRate;
                        }
                        if(pastHourData.low && pastHourData.high) {
                            holding.hourPriceChange = pastHourData.high - pastHourData.low;
                            holding.hourPercentChange = holding.hourPriceChange / pastHourData.low * 100;
                        }
                    }
                });
            });
    };

    this.updatePriceData = function(conversionRate, symbols) {
        // Reset total value
        totalValue = 0;

        // Get price data
        var symbolArr = symbols.split(",");
        var priceDataRetrieved = [];
        $.each(symbolArr, function() {
            priceDataRetrieved.push(getPriceData(this));
        });

        return $.when(...priceDataRetrieved)
            .done(function(...priceData) {
                $.each(priceData, function() {
                    var data = this[0];
                    var price = data.BTC;
                    var holding = holdings[data.symbol];

                    // Reset values
                    holding.coin.hasPriceIncreased = false;
                    holding.coin.hasPriceDecreased = false;

                    // Determine if price increased, decreased, or stayed same
                    var oldPrice = holding.coin.price;
                    var newPrice = price * conversionRate;
                    if(newPrice > oldPrice) {
                        holding.coin.hasPriceIncreased = true;
                    }
                    else if(newPrice < oldPrice) {
                        holding.coin.hasPriceDecreased = true;
                    }

                    holding.coin.price = newPrice;
                    holding.value = holding.coin.price * holding.quantity;
                    holding.net = holding.value - holding.totalCost;

                    totalValue += holding.value;
                });
            });
    };

    this.populateUI = function(table) {
        // Create holdings table
        $.each(holdings, function() {
            var holding = this;
            var row = table.row
                .add([
                    '<img src="' + holding.coin.imageURL + '">' + holding.coin.name,
                    holding.coin.symbol,
                    holding.quantity,
                    "$" + holding.coin.price.toFixed(4),
                    "$" + holding.hourPriceLow.toFixed(4),
                    "$" + holding.hourPriceHigh.toFixed(4),
                    holding.hourPercentChange.toFixed(2) + "%",
                    "$" + holding.dayPriceLow.toFixed(4),
                    "$" + holding.dayPriceHigh.toFixed(4),
                    holding.dayPercentChange.toFixed(2) + "%",
                    "$" + holding.costPerCoin.toFixed(2),
                    "$" + holding.value.toFixed(2),
                    "$" + holding.net.toFixed(2)])
                .draw()
                .node();
            $(row).attr('id', holding.coin.symbol);
        });

        // Add styling to table
        styleTable();

        context.updateTotalsUI();
    };

    function styleTable() {
        const totalColumns = 13;
        var colIndex = 0;
        var priceBackgroundColor;

        $("#table-holdings tbody tr td").each(function() {
            colIndex = colIndex % totalColumns;

            // Color green/red based on pos./neg.
            if(colIndex === 6 || colIndex === 9 || colIndex === 12) {
                var text = this.innerHTML;
                var number = text.replace("$", "");
                var value = parseFloat(number);
                colorPosNeg(this, value);
            }

            // Align content to right
            if(colIndex !== 0 && colIndex !== 1 && colIndex !== 2) {
                $(this).css("text-align", "right");
            }

            colIndex++;
        });
    };

    this.updatePricesUI = function() {
        $.each(holdings, function() {
            var holding = this;
            var coin = holding.coin;
            var symbol = coin.symbol;
            var row = document.getElementById(symbol);
            var cells = row.children;

            cells[3].innerHTML = "$" + coin.price.toFixed(4);
            cells[11].innerHTML = "$" + holding.value.toFixed(2);
            cells[12].innerHTML = "$" + holding.net.toFixed(2)

            // Increased
            if(coin.hasPriceIncreased) {
                cells[3].style.backgroundColor = "#53f18b";
                cells[3].style.color = "#000000";

                cells[11].style.backgroundColor = "#53f18b";
                cells[11].style.color = "#000000";
            }
            // Decreased
            else if(coin.hasPriceDecreased) {
                cells[3].style.backgroundColor = "#ff5050";
                cells[3].style.color = "#000000";

                cells[11].style.backgroundColor = "#ff5050";
                cells[11].style.color = "#000000";
            }
            // Stayed same
            else {
                cells[3].style.backgroundColor = "#2d3134";
                cells[3].style.color = "#F2F2F2";

                cells[11].style.backgroundColor = "#2d3134";
                cells[11].style.color = "#F2F2F2";
            }

            colorPosNeg(cells[12], holding.net);
        });
    };

    this.updateTotalsUI = function() {
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
    };

}).apply(context);

$(document).ready(function() {
    // Create DataTable
    var table = $("#table-holdings").DataTable({
        paging: false,
        scrollX: true,
        dom: '<f<t>>'
    });

    $('#app-title').on('click', function() {
        $('.nav-link').toggle();
    });

    $('#table-holdings').on('click', 'tr', function() {
        $(this).addClass("selected").siblings().removeClass("selected");
    });

    var symbols = context.processPurchases();
    var conversionRate = 0;
    var progress = 0;

    $.when(context.getConversionRateBTCtoUSD())
        .then(function(response) {
            conversionRate = response.USDT;
            return context.populateHoldingsData(conversionRate, symbols)
        })
        .then(function() {
            context.populateUI(table);
        })
        .then(function() {
            setInterval(function() {
                document.getElementById("status").innerHTML = '<i class="fa fa-refresh fa-spin"></i> Fetching new data...';
                return $.when(context.updatePriceData(conversionRate, symbols))
                    .then(function() {
                        setTimeout(function () {
                            $('#status').text("Done!");
                            context.updatePricesUI();
                            context.updateTotalsUI();
                        }, 1000);
                    });
            }, 4000);
        });
});
