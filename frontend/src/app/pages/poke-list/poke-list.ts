import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Pokemon } from '../../models/Pokemon';
import { PokemonStore } from '../../store/pokemon.store';
import { PokemonCard } from '../../ui/pokemon-card/pokemon-card';
import { Import } from './import/import';
import { ImportYourWorld } from './import-your-world/import-your-world';
import { PokemonDetailModal } from '../../ui/pokemon-detail-modal/pokemon-detail-modal';
import AuthService from '../../services/auth.service';
import FavoritesService from '../../services/favorites.service';

@Component({
  selector: 'app-poke-list',
  imports: [CommonModule, FormsModule, RouterModule, PokemonCard, PokemonDetailModal, Import, ImportYourWorld],
  providers: [PokemonStore],
  templateUrl: './poke-list.html',
  styleUrl: './poke-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeList implements OnInit {
  store = inject(PokemonStore)
  private authService = inject(AuthService)
  private favoritesService = inject(FavoritesService)
  router = inject(Router)

  // Local UI state
  q = signal('')
  type = signal<string | undefined>(undefined)
  legendary = signal<string>('') // '', 'true', 'false'
  speedMin = signal<number | null>(null)
  speedMax = signal<number | null>(null)

  limits = [10, 20, 50, 100]
  skeletonItems = Array.from({ length: 8 })
  selectedPokemon = signal<Pokemon | null>(null)
  favoriteIdSet = signal<Set<number>>(new Set())

  ngOnInit(): void {
    // load initial
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

  navigateToCatch() {
    // Navigate to catch page (you can create this route later)
    this.router.navigate(['/catch'])
  }

  clearFilters() {
    // Reset all filters
    this.q.set('')
    this.type.set(undefined)
    this.legendary.set('')
    this.speedMin.set(null)
    this.speedMax.set(null)
    
    // Update store filters and reload
    this.store.updateFilter({
      query: '',
      type: undefined,
      legendary: null,
      speedMin: null,
      speedMax: null,
      page: 1
    })
    this.store.load()
  }
}
