import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RickpediaService {
  private baseUrl = 'https://rickandmortyapi.com/api';
  private teamUrl = 'http://localhost:3000/api/team';

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
      }),
      catchError((err) => this.handleError(err))
    );
  }

  getCharacterById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/character/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getCharactersByIds(ids: string[]): Observable<any[]> {
    const joined = ids.join(',');
    return this.http.get<any>(`${this.baseUrl}/character/${joined}`).pipe(
      map((res) => (Array.isArray(res) ? res : [res])),
      catchError((err) => this.handleError(err))
    );
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
      }),
      catchError((err) => this.handleError(err))
    );
  }

  getLocationById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/location/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
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
      }),
      catchError((err) => this.handleError(err))
    );
  }

  getEpisodeById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/episode/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getEpisodeByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/episode/?name=${name}`).pipe(
      map((res) => res.results?.[0] || null),
      catchError(() => of(null))
    );
  }

  getTeam(): Observable<any[]> {
    return this.http.get<any[]>(this.teamUrl).pipe(catchError(() => of([])));
  }

  getTeamMemberById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.teamUrl}/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  addToTeam(character: any): Observable<any> {
    const payload = {
      id: character.id,
      name: character.name,
      species: character.species,
      status: character.status,
      origin: character.origin?.name || 'Desconocido',
      location: character.location?.name || 'Desconocido',
      gender: character.gender || 'Desconocido',
      type: character.type || 'Desconocido',
      image: character.image,
      created: character.created || new Date().toISOString(),
    };
    return this.http
      .post<any>(this.teamUrl, payload)
      .pipe(catchError((err) => this.handleError(err)));
  }

  updateTeamMember(id: number, changes: any): Observable<any> {
    return this.http
      .patch<any>(`${this.teamUrl}/${id}`, changes)
      .pipe(catchError((err) => this.handleError(err)));
  }

  removeFromTeam(id: string | number): Observable<any> {
    return this.http
      .delete<any>(`${this.teamUrl}/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  isIdTaken(id: number): Observable<boolean> {
    return this.getTeam().pipe(
      map((team) => team.some((member) => member.id === id)),
      catchError(() => of(false))
    );
  }

  private handleError(error: any): Observable<never> {
    const message =
      error?.error?.message ||
      error?.message ||
      'Error desconocido en el servidor';
    return throwError(() => ({ error: { message }, status: error.status }));
  }
}
