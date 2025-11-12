import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationsService } from '../locations.service';
import { CharactersService } from '../../characters/characters.service';
import { Location } from '../location.model';
import { Character } from '../../characters/character.model';

@Component({
  selector: 'app-locations-detail',
  templateUrl: './locations-detail.component.html',
  styleUrls: ['./locations-detail.component.scss'],
})
export class LocationsDetailComponent implements OnInit {
  location: Location | null = null;
  residents: Character[] = [];

  constructor(
    private route: ActivatedRoute,
    private locationsService: LocationsService,
    private charactersService: CharactersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.locationsService.getLocationById(id).subscribe((loc: Location) => {
        this.location = loc;

        const ids = loc.residents.map((url: string) => url.split('/').pop()!);

        if (ids.length > 0) {
          this.charactersService.getCharactersByIds(ids).subscribe((data: Character[]) => {
            this.residents = Array.isArray(data) ? data : [data];
          });
        }
      });
    }
  }
}
