import { Injectable } from '@angular/core';

export interface TeamMember {
  name: string;
  alias: string;
  image: string;
  role: string;
  description: string;
  priority: string;
}

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private team: TeamMember[] = [];

  getTeam(): TeamMember[] {
    return this.team;
  }

  getMemberByAlias(alias: string): TeamMember | undefined {
    return this.team.find((m) => m.alias.toLowerCase() === alias.toLowerCase());
  }

  addMember(member: TeamMember): void {
    this.team.push(member);
  }

  updateMember(alias: string, changes: Partial<TeamMember>): void {
    const index = this.team.findIndex(
      (m) => m.alias.toLowerCase() === alias.toLowerCase()
    );
    if (index !== -1) {
      this.team[index] = { ...this.team[index], ...changes };
    }
  }
}
