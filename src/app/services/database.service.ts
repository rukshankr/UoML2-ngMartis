import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

export interface Asset {
  aId: string;
  status: string;
  gpsLat: string;
  gpsLong: string;
  region: string;
  division: string;
  subdivision: string;
  milepost: string;
  lastTested: string;
}

export interface Test {
  TestID: string;
  DateIssued: string;
  AssetID: string;
  InspectorID: string;
  Result: string;
  SupervisorID: string;
  DateCompleted: string;
  Frequency: string;
  Urgent: string;
  TestModID: string;
  comments: string;
}

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  assets = new BehaviorSubject([]);
  tests = new BehaviorSubject([]);
  databaseErr: any;
  ////
  log: string;
  ////

  constructor(
    private plt: Platform,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
  
    });
  }


  getDatabaseState() {
    const redy =  this.dbReady.asObservable();
    this.log += "\n";
    return redy;
  }

  getAssets(): Observable<Asset[]> {
    return this.assets.asObservable();
  }

  getTests(): Observable<any[]> {
    return this.tests.asObservable();
  }

 }
