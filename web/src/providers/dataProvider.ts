import { TickerDb } from 'firestore/model/tickerDb';
import { FuturesPositionDb } from 'firestore/model/futuresPositionDb';

/* database access layer */
export interface DataProvider {
    getTickers(): Promise<TickerDb[]>;
    getFuturesPositions(): Promise<FuturesPositionDb[]>;
    insertFuturesPosition(data: FuturesPositionDb): Promise<FuturesPositionDb>;
    updateFuturesPosition(data: FuturesPositionDb): Promise<FuturesPositionDb>;
    deleteFuturesPosition(id: string): Promise<void>;
}
