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
        this.hourPriceLow;
        this.hourPriceHigh;
        this.hourPriceChange;
        this.hourPercentChange;

        // Day
        this.dayPriceLow;
        this.dayPriceHigh;
        this.dayPriceChange;
        this.dayPercentChange;
    }
}
