import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'characters',
    loadChildren: () =>
      import('./features/characters/characters.module').then(
        (m) => m.CharactersModule
      ),
  },
  {
    path: 'episodes',
    loadChildren: () =>
      import('./features/episodes/episodes.module').then(
        (m) => m.EpisodesModule
      ),
  },
  {
    path: 'locations',
    loadChildren: () =>
      import('./features/locations/locations.module').then(
        (m) => m.LocationsModule
      ),
  },
  {
    path: 'team',
    loadChildren: () =>
      import('./features/team/team.module').then((m) => m.TeamModule),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
