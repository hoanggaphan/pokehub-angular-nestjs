import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pokemon } from '../models/Pokemon';

@Injectable({ providedIn: 'root' })
export default class FavoritesService {
  private apiUrl = `${environment.apiUrl}/favorite`;
  private http = inject(HttpClient);

  getMyFavorites() {
    return this.http.get<Pokemon[]>(`${this.apiUrl}/me`);
  }

  toggle(pokemonId: number) {
    return this.http.post(`${this.apiUrl}/${pokemonId}`, {});
  }
}

