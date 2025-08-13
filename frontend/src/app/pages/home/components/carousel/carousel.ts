import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-carousel',
  imports: [CarouselModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel {
  customOptions: OwlOptions = {
    loop: true,
    dots: false,
    navSpeed: 700,
    margin: 10,
    navText: ['‹', '›'],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: true
  }
  videos = [
    {
      id: '1',
      title: 'Pokémon Scarlet and Pokémon Violet | Launch Trailer',
      youtubeId: '9ru5Q8s1GmQ',
      thumbnailUrl: 'https://img.youtube.com/vi/9ru5Q8s1GmQ/hqdefault.jpg',
    },
    {
      id: '2',
      title: 'Pokémon Legends: Arceus – Launch Trailer',
      youtubeId: 'I4RynqpahT8',
      thumbnailUrl: 'https://img.youtube.com/vi/I4RynqpahT8/hqdefault.jpg',
    },
    {
      id: '3',
      title: 'Pokémon Sword and Pokémon Shield – Launch Trailer',
      youtubeId: 'uBYORdr_TY8',
      thumbnailUrl: 'https://img.youtube.com/vi/uBYORdr_TY8/hqdefault.jpg',
    },
    {
      id: '4',
      title: 'Detective Pikachu Returns – Launch Trailer',
      youtubeId: 'u8bZl2l7cxQ',
      thumbnailUrl: 'https://img.youtube.com/vi/u8bZl2l7cxQ/hqdefault.jpg',
    },
  ]
}
