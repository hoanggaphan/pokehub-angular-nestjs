import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import PokemonService, { PageResponse } from '../../services/pokemon.service';
import { Pokemon } from '../../models/Pokemon';
import { PokemonCard } from '../../ui/pokemon-card/pokemon-card';

@Component({
  selector: 'app-poke-list',
  imports: [PokemonCard],
  templateUrl: './poke-list.html',
  styleUrl: './poke-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeList implements OnInit {
  private pokemonService = inject(PokemonService)
  pokemons = signal<Pokemon[]>([])

  ngOnInit(): void {
    this.pokemonService.getPaginated({ page: 1, limit: 10 }).subscribe({
      next: (res: PageResponse<Pokemon>) => this.pokemons.set(res.data)
    })
  }
}
