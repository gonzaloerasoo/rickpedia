import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CharactersRoutingModule } from './characters-routing.module';

import { CharactersListComponent } from './characters-list/characters-list.component';
import { CharactersDetailComponent } from './characters-detail/characters-detail.component';

@NgModule({
  declarations: [CharactersListComponent, CharactersDetailComponent],
  imports: [SharedModule, CharactersRoutingModule],
})
export class CharactersModule {}
