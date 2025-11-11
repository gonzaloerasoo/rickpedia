import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RickpediaService } from '../services/rickpedia.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamCreateComponent } from '../team-create/team-create.component';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  member: any = null;
  pageToReturn: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rickpedia: RickpediaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const pageParam = this.route.snapshot.queryParamMap.get('page');

    if (pageParam) {
      this.pageToReturn = +pageParam;
    }

    if (!idParam) {
      this.router.navigate(['/team'], {
        queryParams: { page: this.pageToReturn },
      });
      return;
    }

    this.rickpedia.getTeamMemberById(+idParam).subscribe({
      next: (data) => {
        if (!data || !data.id) {
          this.router.navigate(['/team'], {
            queryParams: { page: this.pageToReturn },
          });
        } else {
          this.member = data;
        }
      },
      error: () => {
        this.router.navigate(['/team'], {
          queryParams: { page: this.pageToReturn },
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/team'], {
      queryParams: { page: this.pageToReturn },
    });
  }

  removeFromTeam(id: number): void {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar este personaje del equipo?'
    );
    if (!confirmed) return;

    this.rickpedia.removeFromTeam(id).subscribe(() => {
      this.router.navigate(['/team'], {
        queryParams: { page: this.pageToReturn },
      });
    });
  }

  openEditDialog(member: any): void {
    const dialogRef = this.dialog.open(TeamCreateComponent, {
      width: '500px',
      disableClose: true,
      data: member,
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.rickpedia.getTeamMemberById(member.id).subscribe((data) => {
          this.member = data;
        });
      }
    });
  }
}
