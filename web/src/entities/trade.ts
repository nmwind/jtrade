export class Trade {
    public id: number;
    public tickerId: string;
    public groupid?: number;
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
