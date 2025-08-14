import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pokemon } from '../models/Pokemon';

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export interface PageResponse<T> {
  data: T[];
  meta: PageMeta;
}

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

  getRandomTrailers(): Observable<Pokemon[]> {
    return this._http.get<Pokemon[]>(`${this.apiUrl}/trailers/random`);
  }

  getPaginated(params: {
    page?: number;
    limit?: number;
    name?: string;
    type?: string;
    generation?: number;
    legendary?: boolean;
  }): Observable<PageResponse<Pokemon>> {
    const queryParams: Record<string, string> = {}
    if (params.page !== undefined) queryParams['page'] = String(params.page)
    if (params.limit !== undefined) queryParams['limit'] = String(params.limit)
    if (params.name) queryParams['name'] = params.name
    if (params.type) queryParams['type'] = params.type
    if (params.generation !== undefined) queryParams['generation'] = String(params.generation)
    if (params.legendary !== undefined) queryParams['legendary'] = String(params.legendary)

    const httpParams = new HttpParams({ fromObject: queryParams })
    return this._http.get<PageResponse<Pokemon>>(this.apiUrl, { params: httpParams })
  }
}
