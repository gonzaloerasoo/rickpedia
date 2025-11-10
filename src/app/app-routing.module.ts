import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CharactersComponent } from './characters/characters.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import { EpisodesComponent } from './episodes/episodes.component';
import { EpisodeDetailComponent } from './episode-detail/episode-detail.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { TeamComponent } from './team/team.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamCreateComponent } from './team-create/team-create.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'characters', component: CharactersComponent },
  { path: 'characters/:id', component: CharacterDetailComponent },
  { path: 'episodes', component: EpisodesComponent },
  { path: 'episodes/:id', component: EpisodeDetailComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'locations/:id', component: LocationDetailComponent },
  { path: 'team', component: TeamComponent },
  { path: 'team-detail/:id', component: TeamDetailComponent },
  { path: 'team-create', component: TeamCreateComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
