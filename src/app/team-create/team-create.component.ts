import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RickpediaService } from '../services/rickpedia.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss'],
})
export class TeamCreateComponent {
  form = this.fb.group({
    id: [null, [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    species: ['', Validators.required],
    status: ['', Validators.required],
    origin: ['', Validators.required],
    location: ['', Validators.required],
    gender: ['', Validators.required],
    type: [''],
    image: [
      '',
      [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png)$/),
      ],
    ],
    created: [new Date().toISOString()],
  });

  constructor(
    private fb: FormBuilder,
    private rickpedia: RickpediaService,
    private dialogRef: MatDialogRef<TeamCreateComponent>
  ) {}

  submit(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      origin: { name: this.form.value.origin },
      location: { name: this.form.value.location },
    };

    this.rickpedia.addToTeam(payload).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
