import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionsComponent } from './positions/positions.component';
import { ArchiveComponent } from './archive/archive.component';
import { AddPositionComponent } from './addPosition/addPosition.component';


const routes: Routes = [
  { path: '', component: AddPositionComponent },
  { path: 'positions', component: PositionsComponent },
  { path: 'archive', component: ArchiveComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
