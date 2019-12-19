import { Component, OnInit } from '@angular/core';
import { Ticker } from 'src/viewmodels';
import { DataService } from 'src/services/data.service';

const getPrecision = (n: number): number => {
  for (var i = 0; n < 1; i++) {
    n *= 10;
  }
  return i;
}

const createNumberEditorOptions = (stepPrice: number): any => {
  const precision = getPrecision(stepPrice);
  return {
    showSpinButtons: true,
    step: stepPrice,
    min: 0,
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
  sizeEditorOptions: any = createNumberEditorOptions(1);
  currencyFormat: any = createCurrencyFormat("RUB");

  tickers: Ticker[];

  constructor(private _dataService: DataService) {
    this.position = new Position();
    this.position.balance = 1850;
    this.position.risk = 0.01;
    this.position.enterPrice = 9548.67;
    this.position.stoploss = 9500;
    this.position.takeprofit = 9900;

    this.priceEditorOptions.format = createCurrencyFormat("RUB");
  }

  ngOnInit() {
    this._dataService.getTickers().then(data => {
      console.log(data);
      this.tickers = data;
      this.position.ticker = this.tickers[0];
    });
  }

}

class Position {
  private _ticker: Ticker;
  public get ticker(): Ticker { return this._ticker; }
  public set ticker(v: Ticker) {
    if (this._ticker !== v) {
      console.log("ticker = " + v);
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
    if (this._size !== v) {
      console.log("size = " + v);
      this._size = v;
      this.calculate("size");
    }
  }

  private _risk: number;
  public get risk(): number { return this._risk; }
  public set risk(v: number) {
    if (this._risk !== v) {
      console.log("risk = " + v);
      this._risk = v;
      this.calculate("risk");
    }
  }

  private _balance: number;
  public get balance(): number { return this._balance; }
  public set balance(v: number) {
    if (this._balance !== v) {
      console.log("balance = " + v);
      this._balance = v;
      this.calculate("balance");
    }
  }

  private calculate(prop: keyof Position) {
    if (this.ticker == null) return;
    switch (prop) {
      case "ticker":
      case "balance":
        this._risk = 0.01;
        this.size = this.calcParam("size");
        break;
      case "risk":
        this.size = this.calcParam("size");
        break;
      case "size":
        this.risk = this.calcParam("risk");
        break;
      case "enterPrice":
      case "stoploss":
      case "takeprofit":
        this.size = this.calcParam("size");
        break;
    }
    console.log("====");
  }

  private calcParam(prop: keyof Position): number {
    if (this.ticker == null) return;
    const pStep = this.ticker.info.priceStep;
    const pStepCost = this.ticker.info.priceStepCost;
    const balance = this.balance * 1000;
    switch (prop) {
      case "size":
        return this.risk * balance / (this.enterPrice - this.stoploss) * (pStepCost / pStep);
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
        return this.size * this.ticker.info.takeMoney;
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
}