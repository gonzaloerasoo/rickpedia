import { Component, OnInit } from '@angular/core';
import { RickpediaService } from '../services/rickpedia.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  locations: any[] = [];

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllLocations().subscribe(data => {
      this.locations = data;
    });
  }
}