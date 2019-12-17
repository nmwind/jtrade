import { TickerDb } from 'firestore/model/tickerDb';

/* database access layer */
export interface DataProvider {
    getTickers(): Promise<TickerDb[]>;
}
