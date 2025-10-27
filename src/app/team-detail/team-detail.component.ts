import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  member: any = null;

  private team = [
    {
      name: 'Justin Roiland',
      alias: 'justin-roiland',
      image: 'assets/team/justin.jpg',
      role: 'Creador',
      description: 'Creador principal y voz de Rick y Morty.',
      priority: 'Alta',
    },
    {
      name: 'Dan Harmon',
      alias: 'dan-harmon',
      image: 'assets/team/dan.jpg',
      role: 'Creador',
      description: 'Co-creador y principal guionista de la serie.',
      priority: 'Alta',
    },
    {
      name: 'Sarah Carbiener',
      alias: 'sarah-carbiener',
      image: 'assets/team/sarah.jpg',
      role: 'Guionista',
      description: 'Guionista destacada con episodios notables.',
      priority: 'Media',
    },
    {
      name: 'James McDermott',
      alias: 'james-mcdermott',
      image: 'assets/team/james.jpg',
      role: 'Productor',
      description: 'Productor clave en la realización del show.',
      priority: 'Baja',
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const aliasParam = this.route.snapshot.paramMap.get('name')?.toLowerCase();
    this.member = this.team.find((m) => m.alias.toLowerCase() === aliasParam);

    if (!this.member) {
      this.router.navigate(['/team']);
    }
  }
}
