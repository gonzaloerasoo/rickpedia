import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationsListComponent } from './locations-list/locations-list.component';
import { LocationsDetailComponent } from './locations-detail/locations-detail.component';

const routes: Routes = [
  { path: '', component: LocationsListComponent },
  { path: ':id', component: LocationsDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsRoutingModule {}
