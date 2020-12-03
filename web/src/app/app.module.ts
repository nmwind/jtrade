import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from "@angular/fire/firestore"

import { environment } from 'src/environments/environment';

import {
   DxTreeListModule, DxDataGridModule, DxSelectBoxModule, DxNavBarModule, DxTemplateModule, DxFormModule
} from 'devextreme-angular';

import { PositionsComponent } from './positions/positions.component';
import { ArchiveComponent } from './archive/archive.component';
import { AddPositionComponent } from './addPosition/addPosition.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FuturesComponent } from './futures/futures.component';
import { FuturesParamsComponent } from './futuresParams/futuresParams.component';

// declare var automapper;

@NgModule({
   declarations: [	
      AppComponent,
      PositionsComponent,
      ArchiveComponent,
      AddPositionComponent,
      FuturesComponent,
      FuturesParamsComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      HttpClientJsonpModule,
      DxTreeListModule,
      DxDataGridModule,
      DxSelectBoxModule,
      DxNavBarModule,
      DxTemplateModule,
      DxFormModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFirestoreModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {
   constructor() {
   }
}
