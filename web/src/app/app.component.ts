import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

import { TradeDb, TickerTypeDb, TickerClassDb, TickerInfoDb, TickerDb } from 'firestore/model';

import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import { Trade } from 'src/viewmodels/trade';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
  }

}