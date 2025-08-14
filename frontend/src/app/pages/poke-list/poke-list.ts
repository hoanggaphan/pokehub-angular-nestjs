import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Pokemon } from '../../models/Pokemon';
import { PokemonStore } from '../../store/pokemon.store';
import { PokemonCard } from '../../ui/pokemon-card/pokemon-card';
import { Import } from './import/import';
import { PokemonDetailModal } from '../../ui/pokemon-detail-modal/pokemon-detail-modal';

@Component({
  selector: 'app-poke-list',
  imports: [CommonModule, FormsModule, RouterModule, PokemonCard, PokemonDetailModal, Import],
  providers: [PokemonStore],
  templateUrl: './poke-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeList implements OnInit {
  store = inject(PokemonStore)
  router = inject(Router)

  // Local UI state
  q = signal('')
  type = signal<string | undefined>(undefined)
  legendary = signal<string>('') // '', 'true', 'false'
  speedMin = signal<number | null>(null)
  speedMax = signal<number | null>(null)

  limits = [10, 20, 50, 100]

  ngOnInit(): void {
    // load initial
    this.store.load()
  }

  selectedPokemon = signal<Pokemon | null>(null)

  openDetail(pokemon: Pokemon) {
    this.selectedPokemon.set(pokemon)
  }

  closeDetail() {
    this.selectedPokemon.set(null)
  }
}
