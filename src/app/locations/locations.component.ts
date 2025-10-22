import { Component, OnInit } from '@angular/core';
import { LocationService } from './locations.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  locations: any[] = [];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.locationService.getAllLocations().subscribe(data => {
      this.locations = data;
    });
  }
}