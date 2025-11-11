import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpisodesListComponent } from './episodes-list/episodes-list.component';
import { EpisodesDetailComponent } from './episodes-detail/episodes-detail.component';

const routes: Routes = [
  { path: '', component: EpisodesListComponent },
  { path: ':id', component: EpisodesDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EpisodesRoutingModule {}
