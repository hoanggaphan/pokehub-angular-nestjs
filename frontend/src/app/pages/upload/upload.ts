import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import PokemonService from '../../services/pokemon.service';

@Component({
  selector: 'app-upload',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    MatToolbarModule,
  ],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {
  private pokemonService = inject(PokemonService);
  private snack = inject(MatSnackBar);

  file?: File;
  uploading = false;
  progress = 0;

  private isCsvFile(file: File): boolean {
    const nameLower = file.name.toLowerCase();
    const typeLower = (file.type || '').toLowerCase();
    const csvMimeTypes = [
      'text/csv',
      'application/csv',
      'application/x-csv',
      'text/comma-separated-values',
      'application/vnd.ms-excel',
    ];
    return nameLower.endsWith('.csv') || csvMimeTypes.includes(typeLower);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selected = input.files[0];
      if (!this.isCsvFile(selected)) {
        this.snack.open('Chỉ chấp nhận file CSV (.csv)', 'Đóng', { duration: 2500 });
        input.value = '';
        this.file = undefined;
        return;
      }
      this.file = selected;
    }
  }

  onUpload() {
    if (!this.file) {
      this.snack.open('Vui lòng chọn file', 'Đóng', { duration: 2500 });
      return;
    }
    if (!this.isCsvFile(this.file)) {
      this.snack.open('Chỉ chấp nhận file CSV (.csv)', 'Đóng', { duration: 2500 });
      return;
    }
    this.uploading = true;
    this.progress = 0;
    this.pokemonService
      .importCsv(this.file)
      .pipe(
        finalize(() => (this.uploading = false)),
      )
      .subscribe({
        next: () => {
          this.snack.open('Import thành công!', 'Đóng', { duration: 2500 });
          this.file = undefined;
          this.progress = 100;
        },
        error: (err) => {
          this.snack.open(err?.error?.message || 'Import thất bại', 'Đóng', {
            duration: 3000,
          });
        },
      });
  }
}
