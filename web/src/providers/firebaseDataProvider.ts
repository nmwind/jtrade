import { DataProvider } from './dataProvider';
import { Observable, of } from 'rxjs';
import { TickerDb, TickerTypeDb, TickerClassDb, TradeDb } from 'firestore/model';
import { AngularFirestore } from '@angular/fire/firestore';

import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FirebaseDataProvider implements DataProvider {
    constructor(private _firestore: AngularFirestore) {
    }

    public async getTickers(): Promise<TickerDb[]> {
        return this._firestore.collection<TickerDb>("tickers").get().toPromise().then(p => {
            let result: TickerDb[] = new Array<TickerDb>();
            p.forEach(doc => {
                let o = <TickerDb>doc.data();
                o.id = doc.id;
                result.push(o);
            });

            return result;
        });
    }

    public async getTrades(): Promise<TradeDb[]> {
        let snap = await this._firestore.collection("trades").get();
        let result: TradeDb[] = new Array<TradeDb>();
        snap.forEach(doc => {
            //result.push(<TradeDb>doc.data());
        });

        return result;
    }

    public async insertTrade(trade: TradeDb): Promise<TradeDb> {
        let snap = await this._firestore.collection("trades").doc();
        debugger;
        // let id = snap.id;
        return null;
    }

    // return of([{
    //     id: "SBRF",
    //     typeId: TickerTypeDb.Futures,
    //     classId: TickerClassDb.Stock,
    //     baseId: "SBER",
    //     lot: 100,
    // },
    // {
    //     id: "GAZR",
    //     typeId: TickerTypeDb.Futures,
    //     classId: TickerClassDb.Stock,
    //     baseId: "GAZP",
    //     lot: 100,
    // },

    // {
    //     id: "GAZP",
    //     typeId: TickerTypeDb.Stock,
    //     classId: TickerClassDb.Stock,
    //     baseId: null,
    //     lot: 10,
    // },
    // {
    //     id: "SBER",
    //     typeId: TickerTypeDb.Stock,
    //     classId: TickerClassDb.Stock,
    //     baseId: null,
    //     lot: 10,
    // },

    // {
    //     id: "GOLD",
    //     typeId: TickerTypeDb.Futures,
    //     classId: TickerClassDb.Commodity,
    //     baseId: null,
    //     lot: 1,
    // },

    // {
    //     id: "Si",
    //     typeId: TickerTypeDb.Futures,
    //     classId: TickerClassDb.Currency,
    //     baseId: "USDRUB_TOM",
    //     lot: 1000,
    // }]);

    // public getTrades(): Observable<TradeDb[]> {
    //     return of([
    //         {
    //             id: "1",
    //             groupId: 1,
    //             enterPrice: 1.1,
    //             tickerId: "SBER",
    //             size: 1,
    //             balance: 1000,
    //             risk: 0.01,
    //             lockedMoney: 1,
    //             createdAt: new Date(),
    //         },
    //         {
    //             id: "2",
    //             groupId: 1,
    //             enterPrice: 2.1,
    //             tickerId: "SBER",
    //             size: 1,
    //             balance: 1000,
    //             risk: 0.01,
    //             lockedMoney: 1,
    //             createdAt: new Date(),
    //         },
    //         {
    //             id: "3",
    //             enterPrice: 3.1,
    //             tickerId: "GAZP",
    //             size: 1,
    //             balance: 1000,
    //             risk: 0.01,
    //             lockedMoney: 1,
    //             createdAt: new Date(),
    //         },
    //     ]);
    // }
}