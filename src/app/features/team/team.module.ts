import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeamRoutingModule } from './team-routing.module';

import { TeamListComponent } from './team-list/team-list.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamCreateComponent } from './team-create/team-create.component';

@NgModule({
  declarations: [TeamListComponent, TeamDetailComponent, TeamCreateComponent],
  imports: [SharedModule, TeamRoutingModule],
})
export class TeamModule {}
