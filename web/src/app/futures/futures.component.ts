import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import CustomStore from 'devextreme/data/custom_store';
import { Ticker, FuturesPosition } from 'src/viewmodels';

@Component({
  selector: 'app-futures',
  templateUrl: './futures.component.html',
  styleUrls: ['./futures.component.css']
})
export class FuturesComponent implements OnInit {
  positionsStore: CustomStore;
  //tickersStore: CustomStore;
  tickers: Ticker[];
  positions: FuturesPosition[];

  static _ref: FuturesComponent;

  constructor(private _dataService: DataService,
    fs: AngularFirestore) {
    FuturesComponent._ref = this;

    // this.tickersStore = new CustomStore({
    //   load: (options) => {
    //     return this._dataService.getTickers();
    //   }
    // });

    this.positionsStore = new CustomStore({
      key: "id",
      load: async (options) => {
        this.positions = await this._dataService.getFuturesPositions();
        return this.positions;
      },
      insert: (values) => {
        const futPos = new FuturesPosition(values);
        futPos.ticker = this.tickers.find(t => t.assetCode == futPos.ticker.assetCode);
        return this._dataService.addFuturesPosition(futPos);
      },
      update: (key, values) => {
        let futPos = this.positions.find(p => p.id == key);
        Object.assign(futPos, values);
        return this._dataService.updateFuturesPosition(futPos);
      },
      remove: (key) => {
        return this._dataService.deleteFuturesPosition(key);
      }
    });
  }

  ngOnInit() {
    this._dataService.getTickers().then(r => this.tickers = r);
  }



  isCopyAvailable(e) {
    return true;
  }

  isSplitAvailable(e) {
    return true;
  }

  isDeleteAvailable(e) {
    return !e.row.isEditing;
  }

  isEditAvailable(e) {
    return !e.row.isEditing;
  }

  isSaveAvailable(e) {
    return e.row.isEditing;
  }

  isCancelEditAvailable(e) {
    return e.row.isEditing;
  }

  copyClick(e) {
    const _this = FuturesComponent._ref;

    let pos = _this.positions.find(p => p.id == e.row.data.id);
    _this._dataService.addFuturesPosition(pos).then(() => {
      e.component.refresh();
    });
  }

  splitClick(e) {

  }

  deleteClick(e) {
    e.component.deleteRow(e.row.dataIndex);
  }

  editClick(e) {
    e.component.editRow(e.row.dataIndex);
  }

  saveClick(e) {
    e.component.saveEditData();
  }

  cancelEditClick(e) {
    e.component.cancelEditData();
  }
}
