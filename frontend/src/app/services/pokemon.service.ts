import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Pokemon {
  private apiUrl = `${environment.apiUrl}/pokemon`;
  _httpClient = inject(HttpClient);

  list() {

  }
}
