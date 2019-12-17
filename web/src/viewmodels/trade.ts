import { Ticker } from '.';

export class Trade {
    // constructor(id: string, ticker?: Ticker) {
    //     this._id = id;
    //     this._ticker = ticker;
    // }

    private _id: string;
    public get id(): string { return this._id; }

    private _ticker: Ticker;
    public get ticker(): Ticker { return this._ticker; }
    public set ticker(value: Ticker) { this._ticker = value; }

    private _groupId?: string;
    public get groupId(): string { return this._groupId; }
    public set groupId(value: string) { this._groupId = value; }

    private _enterPrice: number;
    public get enterPrice(): number { return this._enterPrice; }
    public set enterPrice(v: number) { this._enterPrice = v; }


    private _exitPrice?: number;
    private _stoploss?: number;
    private _takeprofit?: number;
    private _size: number;

    private _balance: number;
    private _risk: number;
    private _lockedMoney: number;

    private _openedAt?: Date;
    private _closedAt?: Date;

    private _createdAt: Date;

    private _children?: Trade[];
    public get children(): Trade[] { return this._children; }

    public get hasItems(): boolean { return this._children != null; }
}