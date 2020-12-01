import { TickerType } from 'general/tickerType.enum';
import { TickerClass } from 'general/tickerClass.enum';
import { TickerInfo } from './tickerInfo';
import { MarketData } from './marketData'
import { TickerDb } from 'firestore/model';
import { Observable } from 'rxjs';

export class Ticker {
    constructor(fields?: any | TickerDb) {
        if (fields) Object.assign(this, fields);
        if (fields) this.title = fields.shortName;
    }

    public id: string;
    public assetCode: string;
    public type: TickerType;
    public class: TickerClass;
    public base?: Ticker;

    public lot: number;
    public title?: string; //???

    public info?: TickerInfo;

    public marketData?: MarketData;
}
class Ticker2 {
    // constructor(id: string, type: TickerType, clss: TickerClass, lot: number,
    //     base?: Ticker, title?: string, info?: TickerInfo) {
    //     this._id = id;
    //     this._type = type;
    //     this._class = clss;
    //     this._lot = lot;
    //     this._base = base;
    //     this._title = title;
    //     this._info = info;
    // }
    private _id: string;
    public get id(): string { return this._id; }
    // public set id(v: string) { this._id = v; }

    private _assetCode: string;
    public get assetCode(): string { return this._assetCode; }

    private _type: TickerType;
    public get type(): TickerType { return this._type; }
    // public set type(v: TickerType) { this._type = v; }

    private _class: TickerClass;
    public get class(): TickerClass { return this._class; }
    // public set class(v: TickerClass) { this._class = v; }

    private _base?: Ticker;
    public get base(): Ticker { return this._base; }
    public set base(v: Ticker) { this._base = v; }

    private _lot: number;
    public get lot(): number { return this._lot; }
    // public set lot(v: number) { this._lot = v; }

    private _title?: string;
    public get title(): string { return this._title; }
    // public set title(v: string) { this._title = v; }

    private _info?: TickerInfo;
    public get info(): TickerInfo { return this._info; }
    public set info(v: TickerInfo) { this._info = v; }

    private _marketData?: MarketData;
    public get marketData(): MarketData { return this._marketData; }
    public set marketData(v: MarketData) { this._marketData = v; }
}