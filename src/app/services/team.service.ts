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
  private team: TeamMember[] = [
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

  getTeam(): TeamMember[] {
    return this.team;
  }

  getMemberByAlias(alias: string): TeamMember | undefined {
    return this.team.find((m) => m.alias.toLowerCase() === alias.toLowerCase());
  }
}
