class Holding
{
    constructor(coin, quantity)
    {
        this.coin = coin;
        this.quantity = quantity;
        this.value = coin.price * quantity;
        //this.net = net;
    }
}
