import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../team.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamCreateComponent } from '../team-create/team-create.component';
import { TeamMember } from '../team-member.model';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  member: TeamMember | null = null;
  pageToReturn: number = 1;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
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

    this.isLoading = true;
    this.teamService.getTeamMemberById(+idParam).subscribe({
      next: (data: TeamMember) => {
        if (!data || !data.id) {
          this.router.navigate(['/team'], {
            queryParams: { page: this.pageToReturn },
          });
        } else {
          this.member = data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
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

    this.teamService.removeFromTeam(id).subscribe(() => {
      this.router.navigate(['/team'], {
        queryParams: { page: this.pageToReturn },
      });
    });
  }

  openEditDialog(member: TeamMember): void {
    const dialogRef = this.dialog.open(TeamCreateComponent, {
      width: '500px',
      disableClose: true,
      data: member,
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.isLoading = true;
        this.teamService.getTeamMemberById(member.id).subscribe((data: TeamMember) => {
          this.member = data;
          this.isLoading = false;
        });
      }
    });
  }
}
