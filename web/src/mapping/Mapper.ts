import AutoMapper from 'ts-automapper';
import { Trade } from 'src/viewmodels/trade';
import { TradeDb, TickerDb } from 'firestore/model';
import { Ticker } from 'src/viewmodels';

export class Mapper {

    public static initialize() {
        AutoMapper.createDefinition<TradeDb, Trade>(Mapper.key(TradeDb, Trade))
            .map(src => src.id, tgt => tgt.id)
            .map(src => src.tickerId, tgt => tgt.id);

        AutoMapper.createDefinition<Trade, TradeDb>(Mapper.key(Trade, TradeDb))
            .map(src => src.id, tgt => tgt.id);

        // AutoMapper.createDefinition<TickerDb, Ticker>(Mapper.key(TickerDb, Ticker))
        //     .map(src => src.id, tgt => tgt.id)
        //     .map(src => src.typeId, tgt => tgt.type)
        //     .map(src=>src.classId, tgt=>tgt.class)
        //     .map(src=>src.lot, tgt=>tgt.lot)
        //     .map(src=>src.baseId, tgt=>(<any>tgt)._base = <Ticker>{id:sr});
    }

    public static map<TSource, TTarget>(src: TSource, srcType: { new(): TSource }, tgtType: { new(): TTarget }): TTarget {
        return AutoMapper.exec<TSource, TTarget>(src, Mapper.key<TSource, TTarget>(srcType, tgtType));
    }

    public static mapList<TSource, TTarget>(src: TSource[], srcType: { new(): TSource }, tgtType: { new(): TTarget }): TTarget[] {
        return AutoMapper.execAll<TSource, TTarget>(src, Mapper.key<TSource, TTarget>(srcType, tgtType));
    }

    private static key<TSource, TTarget>(src: { new(): TSource }, tgt: { new(): TTarget }): string {
        return src.name + "_" + tgt.name
    }
}
