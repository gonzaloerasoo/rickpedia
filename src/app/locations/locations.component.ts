import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  locations: any[] = [];
  displayedColumns: string[] = ['name', 'type', 'dimension'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://rickandmortyapi.com/api/location')
      .subscribe(res => this.locations = res.results);
  }
}