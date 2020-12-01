import { Ticker } from '.';
import { FuturesPositionDb } from 'firestore/model/futuresPositionDb';

export class FuturesPosition {

    constructor(fields?: FuturesPositionDb | any) {
        if (fields) Object.assign(this, fields);
    }

    public id: string;
    //public order: number;
    public ticker: Ticker;
    public enterPrice: number;
    public stoploss: number;
    public takeprofit?: number;
    public size: number;
    public firstLockedMoney: number;


    public exitPrice?: number;

    public get lockedMoney(): number { return Math.abs(this.ticker.info.takeMoney * this.size); }

    public get result(): number {
        const pStep = this.ticker.info.priceStep;
        const pStepCost = this.ticker.info.priceStepCost;

        let closePrice: number;
        if (this.exitPrice == null) {
            closePrice = this.ticker.marketData.last;
        }
        else {
            closePrice = this.exitPrice;
        }

        return pStepCost * this.size * (closePrice - this.enterPrice) / pStep;
    }
}
