import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-poke-list',
  templateUrl: './poke-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeList {

}
