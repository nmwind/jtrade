import { TickerInfoDb } from './tickerInfoDb';

export class TickerDb {
    public id: string;
    public code: string;
    public typeId: number;
    public classId: number;
    public baseId?: string;
    public lot: number;
    public title?: string;

    public info?: TickerInfoDb;
}
