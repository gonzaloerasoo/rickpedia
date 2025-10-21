import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent {
  characters: any[] = [];
  private searchTerm = new Subject<string>();

  constructor(private http: HttpClient) {
    this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        this.http.get<any>(`https://rickandmortyapi.com/api/character/?name=${term}`)
      )
    ).subscribe({
      next: res => this.characters = res.results,
      error: () => this.characters = []
    });
  }

  onSearch(term: string) {
    this.searchTerm.next(term.trim());
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onSearch(input.value);
  }
}