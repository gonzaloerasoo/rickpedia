import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private baseUrl = 'https://rickandmortyapi.com/api/location';

  constructor(private http: HttpClient) {}

  getAllLocations(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      switchMap(res => {
        const totalPages = res.info.pages;
        const requests = [];

        for (let i = 1; i <= totalPages; i++) {
          requests.push(this.http.get<any>(`${this.baseUrl}?page=${i}`));
        }

        return forkJoin(requests).pipe(
          map(pages => pages.flatMap(page => page.results))
        );
      })
    );
  }
}