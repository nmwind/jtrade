import { Injectable, Inject } from '@angular/core';
import { DataProvider } from 'src/providers/dataProvider';
import { Observable, of } from "rxjs"
import { TradeDb, TickerDb, TickerTypeDb, TickerClassDb } from 'firestore/model';
import { Ticker, TickerInfo, Trade } from 'src/viewmodels';
import { FirebaseDataProvider } from 'src/providers/firebaseDataProvider';
import { TickerType, TickerClass, Utils } from 'general';
import { Mapper } from 'src/mapping/Mapper';
import { MoexService, MoexFutures } from './moex.service';

@Injectable({
  providedIn: 'root',
})
/* Data Manager layer */
export class DataService {
  private _tickers: Ticker[];
  private _trades: Trade[];

  constructor(@Inject(FirebaseDataProvider) private _dataProvider: DataProvider,
    private _moexService: MoexService) {
  }

  public getTickers(): Promise<Ticker[]> {
    // return [
    //   <Ticker>{
    //     id: "fut.id",
    //     title: "fut.shortName",
    //     type: TickerType.Futures,
    //     //class: TickerClass.Stock,
    //     lot: 1,
    //     info: <TickerInfo>{
    //       priceStep: 1,
    //       priceStepCost: 1,
    //       takeMoney: 100,
    //     }
    //   }
    // ];
    return this._moexService.getFutures().then(futures => {
      const result = new Array<Ticker>();
      futures.forEach(fut => {
        console.log(fut);
        result.push(<Ticker>{
          id: fut.id,
          title: fut.shortName,
          type: TickerType.Futures,
          //class: TickerClass.Stock,
          lot: fut.lot,
          info: <TickerInfo>{
            priceStep: fut.stepPrice,
            priceStepCost: fut.stepPriceCost,
            takeMoney: fut.margin,
          }
        });
      });
      return result;
    });
    // const futures: MoexFutures[] = await this._moexService.getFutures();
    // return futures.map<Ticker>(fut => {
    //   return <Ticker>{
    //     id: fut.id,
    //     title: fut.shortName,
    //     type: TickerType.Futures,
    //     //class: TickerClass.Stock,
    //     lot: fut.lot,
    //     info: <TickerInfo>{
    //       priceStep: fut.stepPrice,
    //       priceStepCost: fut.stepPriceCost,
    //       takeMoney: fut.margin,
    //     }
    //   }
    // });
  }

  public async getTickers2(): Promise<Ticker[]> {
    const tickersDb = await this._dataProvider.getTickers();
    const dictionaryDb = Utils.toDictionary<TickerDb, TickerDb>(tickersDb, k => k.id, v => v);

    const toTicker = (ticker: TickerDb): Ticker => {
      return <Ticker>{
        id: ticker.id,
        type: ticker.typeId,
        class: ticker.classId,
        lot: ticker.lot,
        title: ticker.title,
        base: ticker.baseId == null ? null : <Ticker>{ id: ticker.baseId },
        info: <TickerInfo>{ priceStep: 1, priceStepCost: 1, takeMoney: 1653 },
      }
    }
    const getTicker = (id: string, dic): Ticker => {
      const ticker = toTicker(dic[id]);
      if (ticker.base != null) {
        ticker.base = getTicker(ticker.base.id, dic);
      }
      return ticker;
    };

    const tickers: Ticker[] = new Array<Ticker>();
    tickersDb.forEach(db => {
      tickers.push(getTicker(db.id, dictionaryDb));
    });


    return tickers;
  }

  public getTrades(): Observable<Trade[]> {
    return of(this._trades);
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
