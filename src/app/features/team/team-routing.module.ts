import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamCreateComponent } from './team-create/team-create.component';

const routes: Routes = [
  { path: '', component: TeamListComponent },
  { path: 'create', component: TeamCreateComponent },
  { path: ':id', component: TeamDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
