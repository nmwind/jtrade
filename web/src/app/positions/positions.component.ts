import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
// import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import { Trade } from 'src/viewmodels';
import { FirebaseDataProvider } from 'src/providers/firebaseDataProvider';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {
  tradesStore: CustomStore;
  tickersStore: CustomStore;

  constructor(private _dataService: DataService,
    fs: AngularFirestore) {
    fs.collection<any>("users").get().forEach(t=>{
      console.log(t);
      let x = t;
      debugger;
    });;
    // let t = fs.collection("users").get().forEach(p => {
    //   let data = p.data();
    //   debugger

    //   console.log(data);
    // });;
    //new FirebaseDataProvider().insertTrade(null);



    this.tickersStore = new CustomStore({
      load: (options) => {
        return this._dataService.getTickers().toPromise();
      }
    });



    this.tradesStore = new CustomStore({
      key: "id",
      load: (options) => {
        return this._dataService.getTrades().toPromise();
      },
      insert: (values) => {
        return this._dataService.insertTrade(<Trade>values);
      },
      // update: (key, values) => {
      //   return 
      // },
      remove: (key) => {
        return this._dataService.deleteTrade(key);
      }
    });
    this._dataService.getTickers();
  }

  itemClick() {
    alert('aa');
  }

  ngOnInit() {

  }

}
