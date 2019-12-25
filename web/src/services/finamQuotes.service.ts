import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export enum Timeframe {
  TICKS = 1,
  MINUTES1 = 2,
  MINUTES5 = 3,
  MINUTES10 = 4,
  MINUTES15 = 5,
  MINUTES30 = 6,
  HOURLY = 7,
  DAILY = 8,
  WEEKLY = 9,
  MONTHLY = 10
};

export interface Candle {
  date: Date,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number
}

export enum Market {
  BONDS = 2,
  COMMODITIES = 24,
  CURRENCIES = 45,
  ETF = 28,
  FUTURES = 14,
  FUTURES_ARCHIVE = 17,
  FUTURES_USA = 7,
  INDEXES = 6,
  SHARES = 1,
  SPB = 517,
  USA = 25
};

@Injectable({
  providedIn: 'root'
})
export class FinamQuotesService {
  private static API_URL: string = "http://export.finam.ru/";
  private static IDS_URL: string = "http://www.finam.ru/cache/icharts/icharts.js";

  private _icharts: ICharts;

  private _initialized: Subject<boolean> = new Subject<boolean>();
  public get InitializedChanged(): Observable<boolean> { return this._initialized; }



  jsonp(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function (data) {
      console.log("eeeeeeeeeeeeee=");
      delete window[callbackName];
      document.body.removeChild(script);
      callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  }




  constructor(private _http: HttpClient) {
    const url = "http://export.finam.ru/input_file.txt?market=14&em=493382&code=SPFB.Si-.20&apply=0&from=05.12.2019&to=05.12.2019&p=8&e=.txt&cn=contract_name&dtf=1&tmf=1&MSOR=1&mstime=on&mstimever=1&sep=1&sep2=1&datf=5&f=result";
    //const url = "https://12Me21.github.io/test.txt";
    // this._http.jsonp(url, "callback").toPromise().then(p => {
    //   debugger
    // });

    // this._http.get(url, {
    //   responseType: "text",
    // }).subscribe(p => {
    //   console.log(p);
    //   debugger;
    // });


    console.log("aaaaaaaaaa");
    this.jsonp(url, function (data) {
      console.log(data);
    });

    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", url);
    // xhr.setRequestHeader("Content-Type",'application/x-www-form-urlencoded');
    // xhr.onload = function () {
    //   console.log(xhr.responseText);
    // }
    // xhr.send();


    // this._http.jsonp<any>(FinamQuotesService.IDS_URL, "callback").toPromise().then(p => {
    //   debugger;
    // });


    // this._http.get<ICharts>(FinamQuotesService.IDS_URL, {
    //   headers: new HttpHeaders()
    // }).subscribe(data => {
    //   this._icharts = data;
    //   this._initialized.next(true);
    // });
  }


  public getCandles(code: string, from: Date, tf: Timeframe = Timeframe.DAILY): Promise<Candle[]> {
    if (this._icharts == null) {
      throw "finamQuotes is not initialized";
    }
    const ichart = this.findByCode(code);
    if (ichart == null) return null;
    const params = {
      p: tf,
      em: ichart.id,
      market: ichart.market,
      df: from.getDate(),
      mf: from.getMonth() - 1,
      yf: from.getFullYear(),
      cn: code,
      code: code,
      datf: tf === Timeframe.TICKS ? 6 : 5
    };

    let url = FinamQuotesService.API_URL + "result.txt?";
    let fieldValues = [];
    for (const field in params) {
      if (params.hasOwnProperty(field)) {
        fieldValues.push(`${field}=${params[field]}`);
      }
    }

    url += fieldValues.join("&");

    return this._http.get(url).toPromise().then<Candle[]>(data => {
      return this.parseCandles(data.toString())
    });
  }

  private parseCandles(file: string): Candle[] {
    const lines = file.split('/r/n');
    const candles = new Array<Candle>(lines.length);
    lines.forEach(line => {
      const args = line.split(',');
      candles.push(<Candle>{
        date: this.parseDateTime(args[0], "date"),
        time: this.parseDateTime(args[1], "time").getTime(),
        open: Number.parseFloat(args[2]),
        high: Number.parseFloat(args[3]),
        low: Number.parseFloat(args[4]),
        close: Number.parseFloat(args[6]),
        volume: Number.parseFloat(args[7]),
      });
    });

    return candles;
  }

  private parseDateTime = (str: string, type: 'date' | 'time'): Date => {
    const match =
      type === 'date'
        ? str.match(/^(\d{4})(\d{2})(\d{2})$/)
        : str.match(/^(\d{2})(\d{2})(\d{2})/);
    if (match) {
      const args: any[] = match.slice(1, 4);
      return type === 'date'
        ? new Date(args[0], args[1], args[2])
        : new Date(1970, 1, 1, args[0], args[1], args[2]);
    }
  };

  private findByCode(code: string): IChart {
    const i = this._icharts.aEmitentCodes.findIndex(el => el == code);
    if (i < 0) return null;
    return <IChart>{
      id: this._icharts.aEmitentIds[i],
      name: this._icharts.aEmitentNames[i],
      code: this._icharts.aEmitentCodes[i],
      market: this._icharts.aEmitentMarkets[i],
    };
  }
}

interface IChart {
  id: number;
  name: string;
  code: string;
  market: number;
}

interface ICharts {
  aEmitentIds: number[];
  aEmitentNames: string[];
  aEmitentCodes: string[];
  aEmitentMarkets: number[];
}