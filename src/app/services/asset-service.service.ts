import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Posts } from '../pages/create-asset/create-asset.page';
 
// Typescript custom enum for search types (optional)
export enum SearchType {
  all = '',
  movie = 'movie',
  series = 'series',
  episode = 'episode'
}
 
@Injectable({
  providedIn: 'root'
})
export class AssetService {
  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient) { }

////////////////if this doesn't work, it's not an error here, but in the API//////////////////////
  post(opost: Posts): Observable <any> {
    return this.http.post("http://localhost:3000/asset/createNewAsset",opost);
  }
}

