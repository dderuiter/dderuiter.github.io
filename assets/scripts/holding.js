class Holding
{
    constructor()
    {
        this.coin = new Coin();
        this.quantity;
        this.value;
        this.totalCost;
        this.costPerCoin;
        this.net;

        // Hour
        this.hourPriceLow = 0;
        this.hourPriceHigh = 0;
        this.hourPriceChange = 0;
        this.hourPercentChange = 0;

        // Day
        this.dayPriceLow = 0;
        this.dayPriceHigh = 0;
        this.dayPriceChange = 0;
        this.dayPercentChange = 0;
    }
}
