import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PokemonCard } from '../../../../ui/pokemon-card/pokemon-card';
import { PokemonDetailModal } from '../../../../ui/pokemon-detail-modal/pokemon-detail-modal';
import PokemonService, { PageResponse } from '../../../../services/pokemon.service';
import AuthService from '../../../../services/auth.service';
import FavoritesService from '../../../../services/favorites.service';
import { Pokemon } from '../../../../models/Pokemon';

@Component({
  selector: 'app-poke-list',
  imports: [PokemonCard, PokemonDetailModal],
  templateUrl: './poke-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeList implements OnInit {
  private pokemonService = inject(PokemonService)
  private authService = inject(AuthService)
  private favoritesService = inject(FavoritesService)
  pokemons = signal<Pokemon[]>([])
  selectedPokemon = signal<Pokemon | null>(null)
  favoriteIdSet = signal<Set<number>>(new Set())

  ngOnInit(): void {
    this.pokemonService.getPaginated({ page: 1, limit: 10 }).subscribe({
      next: (res: PageResponse<Pokemon>) => this.pokemons.set(res.data)
    })

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
}
