export interface FuturesPositionDb {
    id: string;
    //order: number;

    tickerId: string;
    enterPrice: number;
    stoploss?: number;
    takeprofit?: number;
    size: number;
    firstLockedMoney: number;
    exitPrice?: number;

    //result?: number;
}
