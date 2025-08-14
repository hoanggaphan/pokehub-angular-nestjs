import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Carousel } from './components/carousel/carousel';
import { PokeList } from './components/poke-list/poke-list';

@Component({
  selector: 'app-home',
  imports: [Carousel, PokeList],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {

}
