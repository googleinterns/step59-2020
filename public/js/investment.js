'use strict';

class Investment {

  constructor(symbol, share_price, num_shares) {
    this.symbol = symbol;
    this.share_price = share_price;
    this.num_shares = num_shares;
    this.total_purchase_price = share_price * num_shares;
  }

  /* to allow for writing Investment object to database */
  to_dict() {
    const data = {
      "symbol": this.symbol,
      "share_price": this.share_price,
      "num_shares": this.num_shares,
      "total_purchase_price": this.total_purchase_price
    }

    return data;
  }

  /* to interpret Investment from database */
  static from_dict(source) {
    const symbol = source["symbol"];
    const share_price = source["share_price"];
    const num_shares = source["num_shares"];

    return new Investment(symbol, share_price, num_shares);
  }
}