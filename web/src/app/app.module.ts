import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from "@angular/fire/firestore"

import { environment } from 'src/environments/environment';

import { DxTreeListModule, DxSelectBoxModule, DxNavBarModule, DxTemplateModule } from 'devextreme-angular';

import "ts-automapper";
import { PositionsComponent } from './positions/positions.component';
import { ArchiveComponent } from './archive/archive.component';
import { AddPositionComponent } from './addPosition/addPosition.component';

// declare var automapper;

@NgModule({
   declarations: [
      AppComponent,
      PositionsComponent,
      ArchiveComponent,
      AddPositionComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      DxTreeListModule,
      DxSelectBoxModule,
      DxNavBarModule,
      DxTemplateModule,
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
