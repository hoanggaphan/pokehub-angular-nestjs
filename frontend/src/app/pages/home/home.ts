import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Carousel } from './components/carousel/carousel';

@Component({
  selector: 'app-home',
  imports: [Carousel],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {

}
