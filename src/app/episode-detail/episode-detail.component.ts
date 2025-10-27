import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RickpediaService } from '../services/rickpedia.service';

@Component({
  selector: 'app-episode-detail',
  templateUrl: './episode-detail.component.html',
  styleUrls: ['./episode-detail.component.scss'],
})
export class EpisodeDetailComponent implements OnInit {
  episode: any = null;
  characters: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private rickpedia: RickpediaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rickpedia.getEpisodeById(id).subscribe((ep) => {
        this.episode = ep;
        const ids = ep.characters.map((url: string) => url.split('/').pop());
        this.rickpedia.getCharactersByIds(ids).subscribe((data: any) => {
          this.characters = Array.isArray(data) ? data : [data];
        });
      });
    }
  }
}
