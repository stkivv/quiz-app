import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  doPost<T>(urlPath: string, body: any, responseType: 'json' | 'text' = 'json', queryParams: HttpParams = new HttpParams()): Observable<T> {
    const url = environment.apiUrl + urlPath;
    return this.http.post<T>(url, body, { withCredentials: true, responseType: responseType as any, params: queryParams });
  }

  doGet<T>(urlPath: string, responseType: 'json' | 'text' = 'json', queryParams: HttpParams = new HttpParams()) {
    const url = environment.apiUrl + urlPath;
    return this.http.get<T>(url, { withCredentials: true, responseType: responseType as any, params: queryParams })
  }

  doDelete<T>(urlPath: string, responseType: 'json' | 'text' = 'json', queryParams: HttpParams = new HttpParams()) {
    const url = environment.apiUrl + urlPath;
    return this.http.delete<T>(url, { withCredentials: true, responseType: responseType as any, params: queryParams })
  }
}
