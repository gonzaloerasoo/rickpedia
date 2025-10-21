import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  team: any[] = [];
  newMember = { name: '', role: '' };

  constructor(private http: HttpClient) {
    this.loadTeam();
  }

  loadTeam() {
    this.http.get<any[]>('http://localhost:3000/team').subscribe(data => this.team = data);
  }

  addMember() {
    if (!this.newMember.name || !this.newMember.role) return;
    this.http.post('http://localhost:3000/team', this.newMember).subscribe(() => {
      this.newMember = { name: '', role: '' };
      this.loadTeam();
    });
  }

  deleteMember(id: number) {
    this.http.delete(`http://localhost:3000/team/${id}`).subscribe(() => this.loadTeam());
  }
}