import { Injectable, Inject } from '@angular/core';
import { DataProvider } from 'src/providers/dataProvider';
import { Observable, of } from "rxjs"
import { TradeDb, TickerDb, TickerTypeDb, TickerClassDb } from 'firestore/model';
import { Ticker, TickerInfo, Trade } from 'src/viewmodels';
import { FirebaseDataProvider } from 'src/providers/firebaseDataProvider';
import { TickerType, TickerClass } from 'general';

@Injectable({
  providedIn: 'root',
})
/* Data Manager layer */
export class DataService {
  private _tickers: Ticker[];
  private _trades: Trade[];

  constructor(@Inject(FirebaseDataProvider) private _dataProvider: DataProvider) {
    this._tickers = [
      new Ticker("SBRF", TickerType.Futures, TickerClass.Stock, 100),
      new Ticker("GAZR", TickerType.Futures, TickerClass.Stock, 100),
    ];

    this._trades = [
      <Trade>{
        id: "1",
        enterPrice: 100.1,
        groupId: "1",
        ticker: new Ticker("SBRF", TickerType.Futures, TickerClass.Stock, 100),
        children: [
          <Trade>{ id: "2", enterPrice: 100.25, groupId: "1", ticker: new Ticker("SBRF", TickerType.Futures, TickerClass.Stock, 100) },
          <Trade>{ id: "3", enterPrice: 101.25, groupId: "1", ticker: new Ticker("SBRF", TickerType.Futures, TickerClass.Stock, 100) }
        ]
      },
      <Trade>{ id: "4", enterPrice: 256.25, ticker: new Ticker("GAZR", TickerType.Futures, TickerClass.Stock, 100) },
    ];
  }

  public getTickers(): Observable<Ticker[]> {
    return of(this._tickers);
    // return of([{
    //   id: "SBRF",
    //   typeId: TickerTypeDb.Futures,
    //   classId: TickerClassDb.Stock,
    //   baseId: "SBER",
    //   lot: 100,
    // },
    // {
    //   id: "GAZR",
    //   typeId: TickerTypeDb.Futures,
    //   classId: TickerClassDb.Stock,
    //   baseId: "GAZP",
    //   lot: 100,
    // },

    // {
    //   id: "GAZP",
    //   typeId: TickerTypeDb.Stock,
    //   classId: TickerClassDb.Stock,
    //   baseId: null,
    //   lot: 10,
    // },
    // {
    //   id: "SBER",
    //   typeId: TickerTypeDb.Stock,
    //   classId: TickerClassDb.Stock,
    //   baseId: null,
    //   lot: 10,
    // },

    // {
    //   id: "GOLD",
    //   typeId: TickerTypeDb.Futures,
    //   classId: TickerClassDb.Commodity,
    //   baseId: null,
    //   lot: 1,
    // },

    // {
    //   id: "Si",
    //   typeId: TickerTypeDb.Futures,
    //   classId: TickerClassDb.Currency,
    //   baseId: "USDRUB_TOM",
    //   lot: 1000,
    // }]);
  }

  public getTrades(): Observable<Trade[]> {
    return of(this._trades);
    // return of([
    //   {
    //     id: "1",
    //     groupId: 1,
    //     enterPrice: 1.1,
    //     tickerId: "SBER",
    //     size: 1,
    //     balance: 1000,
    //     risk: 0.01,
    //     lockedMoney: 1,
    //     createdAt: new Date(),
    //   },
    //   {
    //     id: "2",
    //     groupId: 1,
    //     enterPrice: 2.1,
    //     tickerId: "SBER",
    //     size: 1,
    //     balance: 1000,
    //     risk: 0.01,
    //     lockedMoney: 1,
    //     createdAt: new Date(),
    //   },
    //   {
    //     id: "3",
    //     enterPrice: 3.1,
    //     tickerId: "GAZP",
    //     size: 1,
    //     balance: 1000,
    //     risk: 0.01,
    //     lockedMoney: 1,
    //     createdAt: new Date(),
    //   },
    // ]);
  }

  public deleteTrade(tradeId: string): Observable<boolean> {
    let i = this._trades.findIndex(k => k.id == tradeId);
    this._trades.splice(i, 1);
    return of(true);
  }

  public insertTrade(trade: Trade): Observable<boolean> {
    this._trades.push(trade);
    return of(true);
  }

  public updateTrade(trade: Trade): Observable<boolean> {
    let i = this._trades.findIndex(k => k.id == trade.id);
    return of(true);
  }
}
