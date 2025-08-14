import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokemon } from '../../models/Pokemon';

@Component({
  selector: 'app-pokemon-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-detail-modal.html',
  styleUrls: ['./pokemon-detail-modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailModal {
  @Input({ required: true }) pokemon!: Pokemon
  @Input() favorite = false
  @Output() closed = new EventEmitter<void>()
  @Output() toggleFavorite = new EventEmitter<Pokemon>()

  onClose() {
    this.closed.emit()
  }

  onToggleFavorite() {
    this.toggleFavorite.emit(this.pokemon)
  }
}


