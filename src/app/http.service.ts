import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  get(url: string): Observable<any> {
    const dataStream = this.http.get(url);
    return dataStream;
  }

  constructor(private http: HttpClient) {
  }
}