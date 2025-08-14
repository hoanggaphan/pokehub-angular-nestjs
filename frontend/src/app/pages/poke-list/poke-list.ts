import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PokemonStore } from '../../store/pokemon.store';
import { Pokemon } from '../../models/Pokemon';
import PokemonService from '../../services/pokemon.service';
import { PokemonCard } from '../../ui/pokemon-card/pokemon-card';

@Component({
  selector: 'app-poke-list',
  imports: [CommonModule, FormsModule, RouterModule, PokemonCard],
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
}
