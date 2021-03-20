import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { SQLitePorter } from "@ionic-native/sqlite-porter/ngx";
import { HttpClient } from "@angular/common/http";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
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
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  assets = new BehaviorSubject([]);
  tests = new BehaviorSubject([]);
  databaseErr: any;

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
      this.sqlite
        .create({
          name: "martislite.db",
          location: "default",
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
    });
  }

  seedDatabase() {
    this.http
      .get("assets/seed.sql", { responseType: "text" })
      .subscribe((sql) => {
        this.sqlitePorter
          .importSqlToDb(this.database, sql)
          .then((_) => {
            this.loadTests();
            this.dbReady.next(true);
          })
          .catch((e) => {
            console.error(e);
            this.databaseErr = e;
          });
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getAssets(): Observable<Asset[]> {
    return this.assets.asObservable();
  }

  getTests(): Observable<any[]> {
    return this.tests.asObservable();
  }

  loadAssets() {
    return this.database.executeSql("SELECT * FROM asset", []).then((data) => {
      let assets: Asset[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          assets.push({
            aId: data.rows.item(i).AssetID,
            status: data.rows.item(i).Satus,
            gpsLat: data.rows.item(i).GPSLatitude,
            gpsLong: data.rows.item(i).GPSLongitude,
            region: data.rows.item(i).Region,
            division: data.rows.item(i).Division,
            subdivision: data.rows.item(i).SubDivision,
            milepost: data.rows.item(i).NearestMilePost,
            lastTested: data.rows.item(i).LastTestedDate,
          });
        }
      }
      this.assets.next(assets);
    });
  }

  loadTests() {
    let query = "SELECT * FROM test";
    return this.database.executeSql(query, []).then((data) => {
      let tests: Test[] = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tests.push({
            TestID: data.rows.item(i).TestID,
            DateIssued: data.rows.item(i).DateIssued,
            AssetID: data.rows.item(i).AssetID,
            InspectorID: data.rows.item(i).InspectorID,
            Result: data.rows.item(i).Result,
            SupervisorID: data.rows.item(i).SupervisorID,
            DateCompleted: data.rows.item(i).DateCompleted,
            Frequency: data.rows.item(i).Frequency,
            Urgent: data.rows.item(i).Urgent,
            TestModID: data.rows.item(i).TestModID,
            comments: data.rows.item(i).comments,
          });
        }
      }
      this.tests.next(tests);
    });
  }
}
