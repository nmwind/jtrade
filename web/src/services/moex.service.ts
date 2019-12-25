import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//list of everything: http://iss.moex.com/iss/index
type iss = {
  only?: "securities";
  meta?: "on" | "off";
}
type QueryParameters = {
  iss?: iss;
  //Выводить фьючерсы с ближайшей датой погашения
  nearest?: 0 | 1;
  //Лидеры торгов (только для futures/options)
  leaders?: 0 | 1;
  //Фильтр-список инструментов. Получение данных производится только по инстурментам из списка securities. Например: securities=GAZP,AFLT,LKOH (не более 10 инструментов).
  securities?: string;
}

interface MoexResponse<T extends MoexEntity> {
  securities: {
    columns: Array<string>,
    data: Array<T>
  }
}

@Injectable({
  providedIn: 'root'
})
export class MoexService {
  private static MOEX_API_URL: string = "https://iss.moex.com";

  constructor(private http: HttpClient) {

  }

  public async getFutures(): Promise<MoexFutures[]> {
    const response = await this.http.get<MoexResponse<MoexFutures>>(MoexService.createUrl("futures", "forts", null, {
      iss: { only: "securities" },
      nearest: 1,
    })).toPromise();

    return MoexService.map<MoexFutures>(MoexFutures, response.securities.columns, response.securities.data);
  }

  private static map<T extends MoexEntity>(T: { new(): T }, columns: string[], data: any[]): T[] {
    const result = new Array<T>(data.length);
    
    data.forEach(element => {
      let instance = new T();

      const mappings: Array<pair> = (<any>instance).mapping;
      mappings.forEach((mapping) => {
        const index = columns.findIndex(col => col == mapping.key);
        instance[mapping.value] = element[index];
      });
      delete (<any>instance).mapping;

      result.push(instance);
    });

    return result;
  }

  private static createUrl(engine: "stock" | "currency" | "futures", market: "shares" | "forts" | "futures", board?: "TQBR" | "TQTF", params?: QueryParameters): string {
    let url: string;
    if (board == null) {
      url = `${MoexService.MOEX_API_URL}/iss/engines/${engine}/markets/${market}/securities.json`;
    } else {
      url = `${MoexService.MOEX_API_URL}/iss/engines/${engine}/markets/${market}/boards/${board}/securities.json`;
    }

    if (params != null) {
      url += "?";
      let fieldValues = [];
      for (const field in params) {
        if (params.hasOwnProperty(field)) {
          fieldValues.push(`${field}=${params[field]}`);
        }
      }

      url += fieldValues.join("&");
    }

    return url;
  }
}

type pair = {
  key: string,
  value: string,
}
abstract class MoexEntity {
  protected abstract mapping: Array<pair>
}

export class MoexFutures extends MoexEntity {
  mapping = [
    { key: "SECID", value: "id" },
    { key: "SHORTNAME", value: "shortName" },
    { key: "DECIMALS", value: "decimals" },
    { key: "MINSTEP", value: "stepPrice" },
    { key: "LASTTRADEDATE", value: "expired" },
    { key: "SECTYPE", value: "secType" },
    { key: "ASSETCODE", value: "assetCode" },
    { key: "LOTVOLUME", value: "lot" },
    { key: "STEPPRICE", value: "stepPriceCost" },
    { key: "INITIALMARGIN", value: "margin" },
  ];

  public id: string;
  public shortName: string;
  public decimals: number;
  public stepPrice: number;
  public expired: Date;
  public secType: string;
  public assetCode: string;
  public lot: number;
  public stepPriceCost: number;
  public margin: number;
}
