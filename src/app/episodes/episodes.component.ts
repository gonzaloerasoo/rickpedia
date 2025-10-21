import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent implements OnInit {
  episodes: any[] = [];
  displayedColumns: string[] = ['name', 'episode', 'air_date'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://rickandmortyapi.com/api/episode')
      .subscribe(res => this.episodes = res.results);
  }
}