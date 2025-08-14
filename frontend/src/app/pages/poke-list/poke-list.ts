import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import PokemonService, { PageResponse } from '../../services/pokemon.service';
import { Pokemon } from '../../models/Pokemon';
import { PokemonCard } from '../../ui/pokemon-card/pokemon-card';
import { PokemonDetailModal } from '../../ui/pokemon-detail-modal/pokemon-detail-modal';

@Component({
  selector: 'app-poke-list',
  imports: [PokemonCard, PokemonDetailModal],
  templateUrl: './poke-list.html',
  styleUrl: './poke-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeList implements OnInit {
  private pokemonService = inject(PokemonService)
  pokemons = signal<Pokemon[]>([])
  selectedPokemon = signal<Pokemon | null>(null)

  ngOnInit(): void {
    this.pokemonService.getPaginated({ page: 1, limit: 10 }).subscribe({
      next: (res: PageResponse<Pokemon>) => this.pokemons.set(res.data)
    })
  }

  openDetail(pokemon: Pokemon) {
    this.selectedPokemon.set(pokemon)
  }

  closeDetail() {
    this.selectedPokemon.set(null)
  }
}
