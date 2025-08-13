import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-poke-list',
  imports: [],
  templateUrl: './poke-list.html',
  styleUrl: './poke-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeList {

}
