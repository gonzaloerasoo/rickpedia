import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RickpediaService {
  private baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getAllCharacters(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/character`).pipe(
      switchMap((res) => {
        const totalPages = res.info.pages;
        const requests = Array.from({ length: totalPages }, (_, i) =>
          this.http.get<any>(`${this.baseUrl}/character?page=${i + 1}`)
        );
        return forkJoin(requests).pipe(
          map((pages) => pages.flatMap((p) => p.results))
        );
      })
    );
  }

  getCharacterById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/character/${id}`);
  }

  getCharactersByIds(ids: string[]): Observable<any[]> {
    const joined = ids.join(',');
    return this.http.get<any[]>(`${this.baseUrl}/character/${joined}`);
  }

  getAllLocations(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/location`).pipe(
      switchMap((res) => {
        const totalPages = res.info.pages;
        const requests = Array.from({ length: totalPages }, (_, i) =>
          this.http.get<any>(`${this.baseUrl}/location?page=${i + 1}`)
        );
        return forkJoin(requests).pipe(
          map((pages) => pages.flatMap((p) => p.results))
        );
      })
    );
  }

  getLocationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/location/${id}`);
  }

  getAllEpisodes(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/episode`).pipe(
      switchMap((res) => {
        const totalPages = res.info.pages;
        const requests = Array.from({ length: totalPages }, (_, i) =>
          this.http.get<any>(`${this.baseUrl}/episode?page=${i + 1}`)
        );
        return forkJoin(requests).pipe(
          map((pages) => pages.flatMap((p) => p.results))
        );
      })
    );
  }

  getEpisodeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/episode/${id}`);
  }

  getEpisodeByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/episode/?name=${name}`).pipe(
      map((res) => res.results?.[0] || null),
      catchError(() => of(null))
    );
  }

  getTeam(): Observable<any[]> {
    return this.http.get<string[]>('http://localhost:3000/api/team').pipe(
      switchMap((ids) => {
        if (!ids.length) return of([]);
        return this.getCharactersByIds(ids);
      })
    );
  }

  addToTeam(characterId: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/team', {
      characterId,
    });
  }

  removeFromTeam(characterId: string): Observable<any> {
    return this.http.delete<any>(
      `http://localhost:3000/api/team/${characterId}`
    );
  }
}
