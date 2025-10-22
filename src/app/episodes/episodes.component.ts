import { Component, OnInit } from '@angular/core';
import { RickpediaService } from '../services/rickpedia.service';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent implements OnInit {
  episodes: any[] = [];

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllEpisodes().subscribe(data => {
      this.episodes = data;
    });
  }
}