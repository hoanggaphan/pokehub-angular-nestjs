import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Pokemon } from '../../models/Pokemon';
import FavoritesService from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites {
  private service = inject(FavoritesService);
  private snack = inject(MatSnackBar);

  pokemons: Pokemon[] = [];
  loading = true;

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.service.getMyFavorites().subscribe({
      next: (data: Pokemon[]) => {
        this.pokemons = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggleFavorite(p: Pokemon): void {
    this.service.toggle(p.id).subscribe({
      next: () => {
        this.snack.open(`${p.name} removed from favorites`, 'Close', { duration: 2000 });
        this.pokemons = this.pokemons.filter((x) => x.id !== p.id);
      },
    });
  }
}
