import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RickpediaService } from '../services/rickpedia.service';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  member: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rickpedia: RickpediaService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/team']);
      return;
    }

    this.rickpedia.getTeamMemberById(+idParam).subscribe({
      next: (data) => {
        if (!data || !data.id) {
          this.router.navigate(['/team']);
        } else {
          this.member = data;
        }
      },
      error: () => {
        this.router.navigate(['/team']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/team']);
  }
}
