import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pokemon } from '../models/Pokemon';

@Injectable({
  providedIn: 'root'
})
export default class PokemonService {
  private apiUrl = `${environment.apiUrl}/pokemon`;
  _http = inject(HttpClient);

  getByQuery(query: string): Observable<Pokemon[]> {
    return this._http.get<Pokemon[]>(`${this.apiUrl}${query}`)
  }

  getById(id: number): Observable<Pokemon> {
    return this._http.get<Pokemon>(`${this.apiUrl}/${id}`)
  }

  importCsv(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this._http.post(`${this.apiUrl}/import-csv`, form);
  }
}
