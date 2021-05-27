import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapLocationService {

  private locSubject = new Subject<any>();

  constructor() { }

  setMapLocation(latitude:number, longitude:number){
    console.log({lat: latitude, long: longitude});
    this.locSubject.next({
      lat: latitude,
      long: longitude
    });
  }

  getMapLocation(): Observable<any>{
    return this.locSubject.asObservable();
  }
}
