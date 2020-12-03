import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { MoexFutures, MoexService } from 'src/services/moex.service';

@Component({
  selector: 'app-futuresParams',
  templateUrl: './futuresParams.component.html',
  styleUrls: ['./futuresParams.component.scss']
})
export class FuturesParamsComponent implements OnInit {
  weigths = [
    'si', 'eu', 'ed', 'gbpu', 'audu', 'ucad', 'ujpy',
    'gold', 'silv', 'plt', 'pld',
    'ng', 'br', 'cl',
    'mix', 'mxi', 'rts',
    'lkoh', 'rosn', 'sngr', 'sngp',
    'notk', 'gazr',
    'plzl', 'poly', 'gmkn',
    'nlmk', 'chmf', 'magn',
    'sbrf', 'sbpr', 'vtbr',
    'alrs',
    'aflt',
  ];
  private getWeight(code: string): number {
    let i = this.weigths.indexOf(code.toLowerCase());
    if (i < 0) return -1;
    return this.weigths.length - i;
  }

  futuresStore: CustomStore;
  futures: MoexFutures[];

  constructor(private _moexService: MoexService) {
    this.futuresStore = new CustomStore({
      key: "assetCode",
      load: async (options) => {
        this.futures = await (await this._moexService.getFutures(true))
          .filter(f => f.prevOpenPosition > 0)
          .sort((a, b) => this.getWeight(b.assetCode)-this.getWeight(a.assetCode));
        //.sort((a, b) => b.prevOpenPosition - a.prevOpenPosition);
        //this.futures = this.futures.
        return this.futures;
      }
    });
  }

  ngOnInit() {
  }

}
