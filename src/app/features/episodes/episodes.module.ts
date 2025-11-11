import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EpisodesRoutingModule } from './episodes-routing.module';

import { EpisodesListComponent } from './episodes-list/episodes-list.component';
import { EpisodesDetailComponent } from './episodes-detail/episodes-detail.component';

@NgModule({
  declarations: [EpisodesListComponent, EpisodesDetailComponent],
  imports: [SharedModule, EpisodesRoutingModule],
})
export class EpisodesModule {}
