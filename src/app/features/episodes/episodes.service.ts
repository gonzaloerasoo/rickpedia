import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Episode } from './episode.model';

@Injectable({ providedIn: 'root' })
export class EpisodesService {
  private baseUrl = 'https://rickandmortyapi.com/api/episode';

  constructor(private http: HttpClient) {}

  getAllEpisodes(): Observable<Episode[]> {
    return this.http
      .get<{ info: { pages: number }; results: Episode[] }>(this.baseUrl)
      .pipe(
        switchMap((res) => {
          const totalPages = res.info.pages;
          const requests = Array.from({ length: totalPages }, (_, i) =>
            this.http.get<{ results: Episode[] }>(
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

  getEpisodesPage(
    page: number
  ): Observable<{ results: Episode[]; info: { pages: number } }> {
    return this.http
      .get<{ results: Episode[]; info: { pages: number } }>(
        `${this.baseUrl}?page=${page}`
      )
      .pipe(catchError(this.handleError));
  }

  getEpisodeById(id: string): Observable<Episode> {
    return this.http
      .get<Episode>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getEpisodeByName(name: string): Observable<Episode | null> {
    return this.http
      .get<{ results: Episode[] }>(`${this.baseUrl}/?name=${name}`)
      .pipe(
        map((res) => res.results?.[0] || null),
        catchError(() => of(null))
      );
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
