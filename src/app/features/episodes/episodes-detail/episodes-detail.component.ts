import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EpisodesService } from '../episodes.service';
import { CharactersService } from '../../characters/characters.service';
import { Episode } from '../episode.model';
import { Character } from '../../characters/character.model';

@Component({
  selector: 'app-episodes-detail',
  templateUrl: './episodes-detail.component.html',
  styleUrls: ['./episodes-detail.component.scss'],
})
export class EpisodesDetailComponent implements OnInit {
  episode: Episode | null = null;
  characters: Character[] = [];

  constructor(
    private route: ActivatedRoute,
    private episodesService: EpisodesService,
    private charactersService: CharactersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.episodesService.getEpisodeById(id).subscribe((ep: Episode) => {
        this.episode = ep;

        const ids = ep.characters.map((url: string) => url.split('/').pop()!);

        this.charactersService.getCharactersByIds(ids).subscribe((data: Character[]) => {
          this.characters = Array.isArray(data) ? data : [data];
        });
      });
    }
  }
}
