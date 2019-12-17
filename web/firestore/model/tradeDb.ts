export class TradeDb {
    public id: string;
    public tickerId: string;
    public groupId?: number;
    public enterPrice: number;
    public exitPrice?: number;
    public stoploss?: number;
    public takeprofit?: number;
    public size: number;

    public balance: number;
    public risk: number;
    public lockedMoney: number;

    public openedAt?: Date;
    public closedAt?: Date;

    public createdAt: Date;
}
