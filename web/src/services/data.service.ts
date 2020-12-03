import { Injectable, Inject } from '@angular/core';
import { DataProvider } from 'src/providers/dataProvider';
import { Observable, of } from "rxjs"
import { TradeDb, TickerDb, TickerTypeDb, TickerClassDb } from 'firestore/model';
import { Ticker, TickerInfo, Trade, FuturesPosition } from 'src/viewmodels';
import { FirebaseDataProvider } from 'src/providers/firebaseDataProvider';
import { TickerType, TickerClass, Utils } from 'general';
import { MoexService, MoexFutures } from './moex.service';
import { MarketData } from 'src/viewmodels/marketData';
import { FuturesPositionDb } from 'firestore/model/futuresPositionDb';

@Injectable({
  providedIn: 'root',
})
/* Data Manager layer */
export class DataService {
  private _tickers: Ticker[] = null;
  private _futPositions: FuturesPosition[] = null;

  private _trades: Trade[] = [];

  constructor(@Inject(FirebaseDataProvider) private _dataProvider: DataProvider,
    private _moexService: MoexService) {

    // this._trades.push(

    //   new Trade({
    //     enterPrice: 1,
    //     ticker: <Ticker>{ id: "SBER" },
    //     children: [new Trade({ enterPrice: 2 })],
    //   })

    // );

    this.refreshTickers().then()
  }

  public get hasTickers(): boolean { return this._tickers != null; }
  public get hasFutPositions(): boolean { return this._futPositions != null; }


  public async refreshTickers(): Promise<void> {
    const tickers = await this._moexService.getFutures().then(futures => {
      const result = new Array<Ticker>();
      futures.forEach(fut => {
        const ticker = new Ticker(fut);
        ticker.info = <TickerInfo>{
          priceStep: fut.stepPrice,
          priceStepCost: fut.stepPriceCost,
          takeMoney: fut.margin,
        };
        result.push(ticker);
      });
      return result;
    });

    if (this._tickers == null) {
      this._tickers = tickers;
    } else {
      tickers.forEach(t => {
        const findTicket = this._tickers.find(old => old.id == t.id);
        findTicket.marketData = t.marketData;
        findTicket.info = t.info;
      })
    }
  }

  public async getFuturesPositions(): Promise<FuturesPosition[]> {
    const result = new Array<FuturesPosition>();
    const futPosDb = (await this._dataProvider.getFuturesPositions());
    const tickers = (await this.getTickers());
    futPosDb.forEach(db => {
      const futPos = new FuturesPosition(db);
      futPos.ticker = tickers.find(t => t.assetCode == db.tickerId);
      result.push(futPos);
    });
    return result;
  }

  public async getTickers(): Promise<Ticker[]> {
    if (!this.hasTickers) {
      await this.refreshTickers();
    }

    return Promise.resolve(this._tickers);

    // return this._moexService.getFutures().then(futures => {
    //   const result = new Array<Ticker>();
    //   futures.forEach(fut => {
    //     result.push(<Ticker>{
    //       id: fut.id,
    //       assetCode: fut.assetCode,
    //       title: fut.shortName,
    //       type: TickerType.Futures,
    //       //class: TickerClass.Stock,
    //       lot: fut.lot,
    //       info: <TickerInfo>{
    //         priceStep: fut.stepPrice,
    //         priceStepCost: fut.stepPriceCost,
    //         takeMoney: fut.margin,
    //       },
    //       marketData: <MarketData>fut.marketData
    //     });
    //   });
    //   return result;
    // });
  }

  public async addFuturesPosition(position: FuturesPosition) {
    let futPosDb = <FuturesPositionDb>{
      tickerId: position.ticker.assetCode,
      //order: (position.order === undefined) ? 0 : position.order,
      size: position.size,
      enterPrice: position.enterPrice,
      stoploss: position.stoploss,
      takeprofit: position.takeprofit,
      exitPrice: position.exitPrice,

      firstLockedMoney: position.lockedMoney,
      //result: position.result,
    };

    this._dataProvider.insertFuturesPosition(futPosDb);
  }

  public async updateFuturesPosition(position: FuturesPosition) {
    let futPosDb = <FuturesPositionDb>{
      id: position.id,
      tickerId: position.ticker.assetCode,
      //order: position.order,
      size: position.size,
      enterPrice: position.enterPrice,
      stoploss: position.stoploss,
      takeprofit: position.takeprofit,
      exitPrice: position.exitPrice,
      firstLockedMoney: position.firstLockedMoney,
      //result: position.result,
    };

    this._dataProvider.updateFuturesPosition(futPosDb);
  }

  public deleteFuturesPosition(id: string): Promise<void> {
    return this._dataProvider.deleteFuturesPosition(id);
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
