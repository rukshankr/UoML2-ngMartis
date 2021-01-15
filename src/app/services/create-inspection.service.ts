import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InspectionPosts } from '../pages/create-inspection/create-inspection.page';
 
 
@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient) { }

////////////////if this doesn't work, it's not an error here, but in the API//////////////////////
  post(opost: InspectionPosts): Observable <any> {
    return this.http.post("http://localhost:3000/test/createNewTest",opost);
  }
}
