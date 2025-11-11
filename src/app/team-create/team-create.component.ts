import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RickpediaService } from '../services/rickpedia.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss'],
})
export class TeamCreateComponent {
  form: FormGroup = this.fb.group({
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

  backendError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private rickpedia: RickpediaService,
    private dialogRef: MatDialogRef<TeamCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.form.patchValue({
        id: data.id,
        name: data.name,
        species: data.species,
        status: data.status,
        origin: this.isNamedObject(data.origin)
          ? data.origin.name
          : data.origin,
        location: this.isNamedObject(data.location)
          ? data.location.name
          : data.location,
        gender: data.gender,
        type: data.type,
        image: data.image,
        created: data.created,
      });
      this.form.get('id')?.disable();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const origin = this.form.value.origin;
    const location = this.form.value.location;

    const payload = {
      ...this.form.getRawValue(),
      origin: this.isNamedObject(origin) ? origin.name : origin,
      location: this.isNamedObject(location) ? location.name : location,
    };

    const request = this.data
      ? this.rickpedia.updateTeamMember(Number(this.data.id), payload)
      : this.rickpedia.addToTeam(payload);

    request.subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.backendError =
          err.error?.message || 'Error al guardar en el servidor';
      },
    });
  }

  private isNamedObject(value: any): value is { name: string } {
    return value && typeof value === 'object' && 'name' in value;
  }
}
