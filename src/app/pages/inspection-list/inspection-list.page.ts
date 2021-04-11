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
          setTimeout(() => {
            loadingEl.dismiss();
          }, 5000);
          this._inspectionListService
            .sortInspectionsByPriority()
            .subscribe((inspections) => {
              loadingEl.dismiss();
              this.lst = Array.of(inspections.data);
              //console.log(this.lst);
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
          setTimeout(() => {
            loadingEl.dismiss();
          }, 5000);
          this._inspectionListService
            .sortInspectionsByPriority()
            .subscribe((inspections) => {
              loadingEl.dismiss();
              this.lst = Array.of(inspections.data);
              //console.log
            });
        });
    } else {
      this.loadingctrl
        .create({
          message: "Loading",
        })
        .then((loadingEl) => {
          loadingEl.present();
          setTimeout(() => {
            loadingEl.dismiss();
          }, 5000);
          this._inspectionListService
            .sortInspectionsByDistance()
            .subscribe((inspections) => {
              if (inspections.data.length === 0) {
                console.log("There was an error");
              }
              loadingEl.dismiss();
              this.lst = Array.of(inspections.data);
              console.log(this.lst);
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
      // initialize the connection
      const db = await this._sqlite.createConnection("martis", false, "no-encryption", 1);

      // open db martis
      await db.open();

      // select all tests in db
      let ret = await db.query("SELECT * FROM test;");
      this.lest = ret.values;

      if(ret.values.length === 0) {
        return Promise.reject(new Error("getTests query failed"));
      }

      // Close Connection MyDB        
      await this._sqlite.closeConnection("martis"); 

      return Promise.resolve();
    } catch (err) {
      // Close Connection MyDB        
      await this._sqlite.closeConnection("martis"); 
      
      //error message
      return Promise.reject(err);
    }
  }
}
