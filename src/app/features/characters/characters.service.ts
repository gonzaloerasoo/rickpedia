import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Character } from './character.model';

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private baseUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getAllCharacters(): Observable<Character[]> {
    return this.http
      .get<{ info: { pages: number }; results: Character[] }>(this.baseUrl)
      .pipe(
        switchMap((res) => {
          const totalPages = res.info.pages;
          const requests = Array.from({ length: totalPages }, (_, i) =>
            this.http.get<{ results: Character[] }>(
              `${this.baseUrl}?page=${i + 1}`
            )
          );
          return forkJoin(requests).pipe(
            map((pages) => pages.flatMap((p) => p.results))
          );
        }),
        catchError(this.handleError)
      );
  }

  getCharacterById(id: string): Observable<Character> {
    return this.http
      .get<Character>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getCharactersByIds(ids: string[]): Observable<Character[]> {
    const joined = ids.join(',');
    return this.http
      .get<Character[] | Character>(`${this.baseUrl}/${joined}`)
      .pipe(
        map((res) => (Array.isArray(res) ? res : [res])),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
