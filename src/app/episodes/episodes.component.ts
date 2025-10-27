import { Component, OnInit } from '@angular/core';
import { RickpediaService } from '../services/rickpedia.service';
import { FormControl } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss'],
})
export class EpisodesComponent implements OnInit {
  episodes: any[] = [];
  filteredEpisodes: any[] = [];
  charactersInEpisode: any[] = [];
  selectedEpisodeTitle = '';

  episodeName = new FormControl('');
  showNameOverlay = true;
  nameFocused = false;
  showFilterPanel = false;

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllEpisodes().subscribe((data) => {
      this.episodes = data;
      this.filteredEpisodes = data;
    });

    this.episodeName.valueChanges.subscribe(() => {
      this.filterEpisodes();
      this.searchCharactersByEpisode();
    });
  }

  filterEpisodes(): void {
    const name = this.episodeName.value?.trim().toLowerCase();
    if (!name) {
      this.filteredEpisodes = this.episodes;
      return;
    }

    this.filteredEpisodes = this.episodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(name) ||
        ep.episode.toLowerCase().includes(name)
    );
  }

  searchCharactersByEpisode(): void {
    const name = this.episodeName.value?.trim();
    if (!name) {
      this.charactersInEpisode = [];
      this.selectedEpisodeTitle = '';
      return;
    }

    this.rickpedia
      .getEpisodeByName(name)
      .pipe(
        map((res: any) => res?.results?.[0] || null),
        catchError(() => of(null))
      )
      .subscribe((episode: any) => {
        if (!episode) {
          this.charactersInEpisode = [];
          this.selectedEpisodeTitle =
            'No se encontró ningún episodio con ese nombre.';
          return;
        }

        this.selectedEpisodeTitle = episode.name;
        const ids = episode.characters.map((url: string) =>
          url.split('/').pop()
        );
        if (ids.length === 0) {
          this.charactersInEpisode = [];
          return;
        }

        this.rickpedia.getCharactersByIds(ids).subscribe((characters: any) => {
          this.charactersInEpisode = Array.isArray(characters)
            ? characters
            : [characters];
        });
      });
  }

  onNameFocus(): void {
    this.nameFocused = true;
    this.showNameOverlay = false;
  }

  onNameBlur(): void {
    this.nameFocused = false;
    if (!this.episodeName.value) this.showNameOverlay = true;
  }
}
