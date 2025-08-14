import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonStore } from '../../../../store/pokemon.store';
import { PokemonCard } from '../../../../ui/pokemon-card/pokemon-card';
import { PokemonDetailModal } from '../../../../ui/pokemon-detail-modal/pokemon-detail-modal';
import AuthService from '../../../../services/auth.service';
import FavoritesService from '../../../../services/favorites.service';
import { Pokemon } from '../../../../models/Pokemon';

@Component({
  selector: 'app-poke-list',
  imports: [PokemonCard, PokemonDetailModal],
  providers: [PokemonStore],
  templateUrl: './poke-list.html',
  styleUrl: './poke-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeList implements OnInit {
  store = inject(PokemonStore)
  private authService = inject(AuthService)
  private favoritesService = inject(FavoritesService)
  private router = inject(Router)
  selectedPokemon = signal<Pokemon | null>(null)
  favoriteIdSet = signal<Set<number>>(new Set())
  skeletonItems = Array.from({ length: 10 })

  ngOnInit(): void {
    this.store.load()

    if (this.authService.isLogged()) {
      this.favoritesService.getMyFavorites().subscribe({
        next: (list) => this.favoriteIdSet.set(new Set(list.map(p => p.id)))
      })
    }
  }

  openDetail(pokemon: Pokemon) {
    this.selectedPokemon.set(pokemon)
  }

  closeDetail() {
    this.selectedPokemon.set(null)
  }

  handleToggleFavorite = (pokemon: Pokemon) => {
    if (!this.authService.isLogged()) {
      alert('Please login to favorite Pokémon.')
      return
    }
    this.favoritesService.toggle(pokemon.id).subscribe({
      next: () => {
        const set = new Set(this.favoriteIdSet())
        if (set.has(pokemon.id)) set.delete(pokemon.id); else set.add(pokemon.id)
        this.favoriteIdSet.set(set)
      }
    })
  }

  clearFilters(): void {
    this.store.updateFilter({ query: '', page: 1, type: undefined, legendary: null, speedMin: null, speedMax: null })
    this.store.load()
  }

  navigateToPokemon(): void {
    this.router.navigate(['/pokemon'])
  }
}
