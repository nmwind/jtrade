import { Component, OnInit, ViewChild } from '@angular/core';
import { Ticker } from 'src/viewmodels';
import { DataService } from 'src/services/data.service';

const getPrecision = (n: number): number => {
  for (var i = 0; n < 1; i++) {
    n *= 10;
  }
  return i;
}

const createNumberEditorOptions = (stepPrice: number, min: number = 0): any => {
  const precision = getPrecision(stepPrice);
  return {
    showSpinButtons: true,
    step: stepPrice,
    min: min,
    format: precision > 0 ? "#0.".padEnd(3 + precision, "#") : "#"
  };
}

const createCurrencyFormat = (code: string): any => {
  return {
    style: 'currency',
    currency: code,
  }
}

const round2 = (n: number): number => {
  return Math.round(n * 100) / 100;
}

@Component({
  selector: 'app-addPosition',
  templateUrl: './addPosition.component.html',
  styleUrls: ['./addPosition.component.css']
})
export class AddPositionComponent implements OnInit {
  position: Position;

  priceEditorOptions: any = createNumberEditorOptions(0.05);
  sizeEditorOptions: any = createNumberEditorOptions(1, -10000000);
  currencyFormat: any = createCurrencyFormat("RUB");

  tickers: Ticker[] = [];

  private static _ref: AddPositionComponent;

  constructor(private _dataService: DataService) {

    this.position = new Position();

    //this.priceEditorOptions.format = createCurrencyFormat("RUB");
    // this._moexService.getFutures().then(p => {
    //   // console.log(p);
    // });

    //Из-за невозможности внутри события элемента формы (OnSelected) получить ссылку на текущий компонент
    AddPositionComponent._ref = this;
  }

  ngOnInit() {
    this.position.balance = this.readOrDefault("portfolio.balance", 1000);
    this.position.risk = new Number(this.readOrDefault("portfolio.risk", 0.01)).valueOf();

    this._dataService.getTickers().then(data => {
      this.tickers = data.sort((t1, t2) => t1.marketData.volume < t2.marketData.volume ? 1 : -1);

      let i = this.tickers.findIndex(f => f.id.startsWith(this.readOrDefault("tickerId", "RI")));
      if (i == -1) i = 0;

      this.setTicker(this.tickers[i]);
    });
  }

  protected onSelected(args) {
    if (args.value != null) {
      const _this = AddPositionComponent._ref;
      const ticker = _this.tickers.find((ticker) => ticker.id == args.value);
      _this.setTicker(ticker);
    }
  }

  protected setTicker(ticker: Ticker) {
    this.priceEditorOptions = createNumberEditorOptions(ticker.info.priceStep);

    //ticker.marketData.last = 153420;
    this.position.enterPrice = ticker.marketData.last;
    this.position.stoploss = ticker.marketData.last - ticker.marketData.last * 0.01;
    this.position.takeprofit = ticker.marketData.last + ticker.marketData.last * 0.03;

    this.position.ticker = ticker;
  }

  protected tickerDisplayFormat(ticker: Ticker) {
    if (ticker == null) return null;
    return `${ticker.title}  (${ticker.marketData.last})`;
  }

  private readOrDefault(key: string, def: any): any {
    const value = window.localStorage.getItem(key);
    return value == null ? def : value;
  }
}

class Position {
  public tickerId: string;

  private _ticker: Ticker;
  public get ticker(): Ticker { return this._ticker; }
  public set ticker(v: Ticker) {
    if (this._ticker !== v) {
      console.log("ticker = " + v.id);
      this.tickerId = v.id;
      window.localStorage.setItem("tickerId", v.id);
      this._ticker = v;
      this.calculate("ticker");
    }
  }

  private _enterPrice: number;
  public get enterPrice(): number { return this._enterPrice; }
  public set enterPrice(v: number) {
    if (this._enterPrice !== v) {
      console.log("enterPrice = " + v);
      this._enterPrice = v;
      this.calculate("enterPrice");
    }
  }

  private _stoploss: number;
  public get stoploss(): number { return this._stoploss; }
  public set stoploss(v: number) {
    if (this._stoploss !== v) {
      console.log("stoploss = " + v);
      this._stoploss = v;
      this.calculate("stoploss");
    }
  }

  private _takeprofit: number;
  public get takeprofit(): number { return this._takeprofit; }
  public set takeprofit(v: number) {
    if (this._takeprofit !== v) {
      console.log("takeprofit = " + v);
      this._takeprofit = v;
      this.calculate("takeprofit");
    }
  }

  private _size: number;
  public get size(): number { return this._size; }
  public set size(v: number) {
    if (this._size !== v && !isNaN(v)) {
      console.log("size = " + v);
      this._size = v;
      this.calculate("size");
    }
  }

  private _risk: number;
  public get risk(): number { return this._risk; }
  public set risk(v: number) {
    if (this._risk !== v && !isNaN(v)) {
      console.log("risk = " + v);
      this._risk = v;
      window.localStorage.setItem("portfolio.risk", v.toString());
      this.calculate("risk");
    }
  }

  private _balance: number;
  public get balance(): number { return this._balance; }
  public set balance(v: number) {
    if (this._balance !== v) {
      console.log("balance = " + v);
      this._balance = v;
      window.localStorage.setItem("portfolio.balance", v.toString());
      this.calculate("balance");
    }
  }

  private calculate(prop: keyof Position) {
    if (this.ticker == null) return;
    switch (prop) {
      case "ticker":
      case "balance":
        //Расскоментить, если есть замыкание на size-risk
        //this._risk = 0.01;
        this.size = this.calcParam("size");
        break;
      case "risk":
        this.size = this.calcParam("size");
        break;
      case "size":
        //this.risk = this.calcParam("risk");
        break;
      case "enterPrice":
      case "stoploss":
      case "takeprofit":
        this.size = this.calcParam("size");
        break;
    }
    console.log("=== calculate :: " + prop);
  }

  private calcParam(prop: keyof Position): number {
    if (this.ticker == null) return;
    const pStep = this.ticker.info.priceStep;
    const pStepCost = this.ticker.info.priceStepCost;
    const balance = this.balance * 1000;
    switch (prop) {
      case "size":
        return this.risk * balance / ((this.enterPrice - this.stoploss) * (pStepCost / pStep));
      case "risk":
        return (this.enterPrice - this.stoploss) * (pStepCost / pStep) * this.size / balance;
      case "loss":
        return pStepCost * this.size * (this.stoploss - this.enterPrice) / pStep;
      case "take":
        return pStepCost * this.size * (this.takeprofit - this.enterPrice) / pStep;
      case "rmult":
        const sizeInPercents = round2(Math.abs(this.risk * this.enterPrice / (this.enterPrice - this.stoploss)));
        return Math.abs(this.takeprofit / this.enterPrice - 1) * sizeInPercents / this.risk;
      case "lockedMoney":
        return Math.abs(this.size * this.ticker.info.takeMoney);
    }
  }

  private calcParams(...props: Array<keyof Position>) {
    props.forEach(prop => { this.calcParam(prop); });
  }

  public get loss(): number { return this.calcParam("loss"); }
  public get take(): number { return this.calcParam("take"); }
  public get lockedMoney(): number { return this.calcParam("lockedMoney"); }
  public get rmult(): number { return this.calcParam("rmult"); }
  public get result(): number { return 0; }
  public get frisk(): number { return this.calcParam("risk"); }
}