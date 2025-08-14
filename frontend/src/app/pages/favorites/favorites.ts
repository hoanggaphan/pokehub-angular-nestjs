import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Pokemon } from '../../models/Pokemon';
import FavoritesService from '../../services/favorites.service';
import { PokemonCard } from '../../ui/pokemon-card/pokemon-card';
import { PokemonDetailModal } from '../../ui/pokemon-detail-modal/pokemon-detail-modal';

@Component({
  selector: 'app-favorites',
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    PokemonCard,
    PokemonDetailModal,
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites {
  private service = inject(FavoritesService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  pokemons = signal<Pokemon[]>([]);
  loading = signal(true);
  selectedPokemon = signal<Pokemon | null>(null);
  favoriteIdSet = signal<Set<number>>(new Set());
  skeletonItems = Array.from({ length: 8 });

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.service.getMyFavorites().subscribe({
      next: (data: Pokemon[]) => {
        this.pokemons.set(data);
        this.favoriteIdSet.set(new Set(data.map(p => p.id)));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openDetail(pokemon: Pokemon) {
    this.selectedPokemon.set(pokemon);
  }

  closeDetail() {
    this.selectedPokemon.set(null);
  }

  handleToggleFavorite(pokemon: Pokemon): void {
    this.service.toggle(pokemon.id).subscribe({
      next: () => {
        this.snack.open(`${pokemon.name} removed from favorites`, 'Close', { duration: 2000 });
        // Remove from favorites list
        this.pokemons.set(this.pokemons().filter(p => p.id !== pokemon.id));
        // Update favorite set
        const set = new Set(this.favoriteIdSet());
        set.delete(pokemon.id);
        this.favoriteIdSet.set(set);
      },
    });
  }

  navigateToPokeList() {
    this.router.navigate(['/poke-list']);
  }
}
