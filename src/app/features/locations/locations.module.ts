import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LocationsRoutingModule } from './locations-routing.module';

import { LocationsListComponent } from './locations-list/locations-list.component';
import { LocationsDetailComponent } from './locations-detail/locations-detail.component';

@NgModule({
  declarations: [LocationsListComponent, LocationsDetailComponent],
  imports: [SharedModule, LocationsRoutingModule],
})
export class LocationsModule {}
