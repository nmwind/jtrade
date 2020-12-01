import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionsComponent } from './positions/positions.component';
import { ArchiveComponent } from './archive/archive.component';
import { AddPositionComponent } from './addPosition/addPosition.component';
import { FuturesComponent } from './futures/futures.component';


const routes: Routes = [
  { path: '', component: FuturesComponent },
  { path: 'futures', component: FuturesComponent },
  { path: 'positions', component: PositionsComponent },
  { path: 'add', component: AddPositionComponent },
  { path: 'archive', component: ArchiveComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
