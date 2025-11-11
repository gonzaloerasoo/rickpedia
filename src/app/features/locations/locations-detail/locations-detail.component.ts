import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RickpediaService } from '../../../core/rickpedia.service';

@Component({
  selector: 'app-locations-detail',
  templateUrl: './locations-detail.component.html',
  styleUrls: ['./locations-detail.component.scss'],
})
export class LocationsDetailComponent implements OnInit {
  location: any = null;
  residents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private rickpedia: RickpediaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rickpedia.getLocationById(id).subscribe((loc) => {
        this.location = loc;
        const ids = loc.residents.map((url: string) => url.split('/').pop());
        if (ids.length > 0) {
          this.rickpedia.getCharactersByIds(ids).subscribe((data: any) => {
            this.residents = Array.isArray(data) ? data : [data];
          });
        }
      });
    }
  }
}
