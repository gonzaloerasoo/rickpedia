import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TeamMember } from './team-member.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private teamUrl = 'http://localhost:3000/api/team';

  constructor(private http: HttpClient) {}

  getTeam(): Observable<TeamMember[]> {
    return this.http
      .get<TeamMember[]>(this.teamUrl)
      .pipe(catchError(() => of([])));
  }

  getTeamMemberById(id: number): Observable<TeamMember> {
    return this.http
      .get<TeamMember>(`${this.teamUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addToTeam(member: TeamMember): Observable<TeamMember> {
    return this.http
      .post<TeamMember>(this.teamUrl, member)
      .pipe(catchError(this.handleError));
  }

  updateTeamMember(
    id: number,
    changes: Partial<TeamMember>
  ): Observable<TeamMember> {
    return this.http
      .patch<TeamMember>(`${this.teamUrl}/${id}`, changes)
      .pipe(catchError(this.handleError));
  }

  removeFromTeam(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.teamUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  isIdTaken(id: number): Observable<boolean> {
    return this.getTeam().pipe(
      map((team) => team.some((member) => member.id === id)),
      catchError(() => of(false))
    );
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
