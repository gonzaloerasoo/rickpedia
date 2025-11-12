import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Location } from './location.model';

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private baseUrl = 'https://rickandmortyapi.com/api/location';

  constructor(private http: HttpClient) {}

  getAllLocations(): Observable<Location[]> {
    return this.http.get<{ info: { pages: number }; results: Location[] }>(this.baseUrl).pipe(
      switchMap((res) => {
        const totalPages = res.info.pages;
        const requests = Array.from({ length: totalPages }, (_, i) =>
          this.http.get<{ results: Location[] }>(`${this.baseUrl}?page=${i + 1}`)
        );
        return forkJoin(requests).pipe(map((pages) => pages.flatMap((p) => p.results)));
      }),
      catchError(this.handleError)
    );
  }

  getLocationById(id: string): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
