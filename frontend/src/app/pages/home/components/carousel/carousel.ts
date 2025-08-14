import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import PokemonService from '../../../../services/pokemon.service';
import { Pokemon } from '../../../../models/Pokemon';

@Component({
  selector: 'app-carousel',
  imports: [CarouselModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel implements OnInit {
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
  videos = signal<Pokemon[]>([])

  private pokemonService = inject(PokemonService)

  ngOnInit(): void {
    this.pokemonService.getRandomTrailers().subscribe({
      next: (pokemons) => {
        this.videos.set(pokemons)
      }
    })
  }

  toIdString(id: number): string {
    return String(id)
  }
}
