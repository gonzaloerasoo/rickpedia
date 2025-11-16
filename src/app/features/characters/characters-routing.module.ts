import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharactersListComponent } from './characters-list/characters-list.component';
import { CharactersDetailComponent } from './characters-detail/characters-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CharactersListComponent,
  },
  {
    path: ':id',
    component: CharactersDetailComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class CharactersRoutingModule {}
