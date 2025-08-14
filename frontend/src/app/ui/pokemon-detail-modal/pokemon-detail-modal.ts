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
  @Output() closed = new EventEmitter<void>()

  onClose() {
    this.closed.emit()
  }
}


