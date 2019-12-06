import { TickerInfo } from './tickerInfo';

export class Ticker {
    public id: string;
    public typeId: string;
    public baseId?: string;
    public lot: number;

    public info?: TickerInfo;
}
