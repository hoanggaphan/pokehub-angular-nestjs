import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokemon } from '../../models/Pokemon';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-card.html',
  styleUrls: ['./pokemon-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCard {
  @Input({ required: true }) pokemon!: Pokemon
  @Input() favorite = false
  @Output() view = new EventEmitter<Pokemon>()
  @Output() toggleFavorite = new EventEmitter<Pokemon>()

  onViewDetail() {
    this.view.emit(this.pokemon)
  }

  onToggleFavorite() {
    this.toggleFavorite.emit(this.pokemon)
  }
}


