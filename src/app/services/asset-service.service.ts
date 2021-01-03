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
  url = 'http://www.omdbapi.com/';
 
  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient) { }

  getComments(): Observable <any> {
    return this.http.get("https://jsonplaceholder.typicode.com/posts/1/comments")
  }

  getCommentsByParam(): Observable <any> {
    let params1 = new HttpParams().set('userId',"1");
    return this.http.get("https://jsonplaceholder.typicode.com/posts",{params: params1})
  }

  post(opost: Posts): Observable <any> {
    return this.http.post("http://localhost:3000/asset/createNewAsset",opost);
  }
}

