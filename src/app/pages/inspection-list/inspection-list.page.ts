import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Observable, Subscription } from "rxjs";
import { DatabaseService, Test } from "src/app/services/database.service";
import { inspectionListService } from "src/app/services/inspection-list.service";
import { SqliteService } from "src/app/services/sqlite.service";

import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-inspection-list",
  templateUrl: "./inspection-list.page.html",
  styleUrls: ["./inspection-list.page.scss"],
})
export class InspectionListPage implements OnInit {
  constructor(
    private _inspectionListService: inspectionListService,
    private _sqlite: SqliteService,
    private plt: Platform,
    private alertCtrl: AlertController,
    private loadingctrl: LoadingController
  ) {}

  lst: any = [];
  lest = [];
  desktop: boolean = true;
  ////
  log: string;
  ////

  filterOption = "priority";

  async ngOnInit() {
    const showAlert = async (message: string) => {
      let msg = this.alertCtrl.create({
        header: "Error",
        message: message,
        buttons: ["OK"],
      });
      (await msg).present();
    };
    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
      try {
        await this.runTest();
        this.log += "\n$$$ runTest was successful\n";
      } catch (err) {
        this.log += "\n " + err.message;
        await showAlert(err.message);
      }
    } else if (this.plt.is("desktop")) {
      this.loadingctrl
        .create({
          message: "Loading",
        })
        .then((loadingEl) => {
          loadingEl.present();
          this._inspectionListService
            .sortInspectionsByPriority()
            .subscribe((inspections) => {
              loadingEl.dismiss();
              this.lst = Array.of(inspections.data);
            });
        });
    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.filterOption = event.detail.value;

    if (this.filterOption === "priority") {
      this.loadingctrl
        .create({
          message: "Loading",
        })
        .then((loadingEl) => {
          loadingEl.present();
          this._inspectionListService
            .sortInspectionsByPriority()
            .subscribe((inspections) => {
              loadingEl.dismiss();
              this.lst = Array.of(inspections.data);
            });
        });
    } else {
      this.loadingctrl
        .create({
          message: "Loading",
        })
        .then((loadingEl) => {
          loadingEl.present();
          this._inspectionListService
            .sortInspectionsByDistance()
            .subscribe((inspections) => {
              if (inspections.data.length === 0) {
                console.log("There was an error");
              }
              loadingEl.dismiss();
              this.lst = Array.of(inspections.data);
            });
        });
    }
  }

  async checkPlatform() {
    let alert = this.alertCtrl.create({
      header: "Platform",
      message: "You are running on: " + this.plt.platforms(),
      buttons: ["OK"],
    });
    (await alert).present();
  }

  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");
      this.log += " from Echo " + result.value;
      // initialize the connection
      const db = await this._sqlite.createConnection(
        "martis",
        false,
        "no-encryption",
        1
      );
      this.log += "\ndb connected " + db;

      // check if the databases exist
      // and delete it for multiple successive tests
      //await deleteDatabase(db);

      // open db testNew
      await db.open();
      this.log += "\ndb opened";
      // create tables in db
      // let ret: any = await db.execute(createSchema);
      // if (ret.changes.changes < 0) {
      //   return Promise.reject(new Error("Execute createSchema failed"));
      // }

      // create synchronization table
      let ret: any = await db.createSyncTable();
      console.log(
        "$$$ createSyncTable ret.changes.changes in db " + ret.changes.changes
      );

      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      // select all assets in db
      ret = await db.query("SELECT * FROM test;");
      this.lest = ret.values;
      if (ret.values.length === 0) {
        return Promise.reject(new Error("getTests query failed"));
      }
      this.log += "\nquery done.";
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      this.log += "\n> closeConnection 'myDb' successful\n";

      return Promise.resolve();
    } catch (err) {
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      this.log += "\n> closed Connection: 'martis'\n";
      //error message
      this.log += "\nrejected";
      return Promise.reject(err);
    }
  }
}
