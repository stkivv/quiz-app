import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  doPost<T>(urlPath: string, body: any): Observable<T> {
    const url = environment.apiUrl + urlPath;
    return this.http.post<T>(url, body);
  }
}
