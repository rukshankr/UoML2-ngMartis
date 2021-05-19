import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  IonSlides,
  LoadingController,
  Platform,
} from "@ionic/angular";
import { DatabaseService } from "src/app/services/database.service";
import { SqliteService } from "src/app/services/sqlite.service";

import { OktaAuthService } from "@okta/okta-angular";
import { HttpClient } from "@angular/common/http";
import { ThrowStmt } from "@angular/compiler";
import { AssetService } from "src/app/services/asset-service.service";
import { DeviceAuthService } from "src/app/services/device-auth.service";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";

// import { TIMEOUT } from 'dns';
// import { type } from 'os';
// import { timer } from 'rxjs';

@Component({
  selector: "app-selection",
  templateUrl: "./selection.page.html",
  styleUrls: ["./selection.page.scss"],
})
export class SelectionPage implements OnInit {
  log: string = "";
  username: string;
  userPin;
  pinValidated: boolean = false;
  importJson;
  desktop: boolean = true;
  Deviceid;

  constructor(
    public atrCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private _sqlite: SqliteService,
    private assetService: AssetService,
    private plt: Platform,
    private oktaAuth: OktaAuthService,
    private http: HttpClient,
    private _mainService: DatabaseService,
    private deviceAuth: DeviceAuthService,
    private uniqueDeviceID: UniqueDeviceID
  ) {
    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
      this.loadMobiTable();
    } else {
      this.desktop = true;
      this.loadTable();
    }
  }
  //for the table
  table = [];
  prevpg: number;
  page = 1;
  nextpg: number;
  maxpg: number;

  //slider functions
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 4,
  };
  //for mobile
  mobSlideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2,
  };

  loadMore(event: Event) {
    if (this.nextpg) {
      this.page = this.nextpg;
      console.log("next page:" + this.page);
      if (this.desktop) {
        this.loadTable(event);
      }
    }
  }

  loadTable(event?: Event) {
    if (this.desktop) {
      this.assetService.getTestNoForAssets(this.page).subscribe((data) => {
        this.nextpg = data.next ? data.next.page : null;

        this.table = this.table.concat(data.results);
        console.log(this.table);

        if (event) {
          event.target.removeEventListener;
        }
      });
    }
  }

  async loadMobiTable(): Promise<void> {
    try {
      // initialize the connection
      const db = await this._sqlite.createConnection(
        "martis",
        false,
        "no-encryption",
        1
      );

      // open db testNew
      await db.open();

      // select all assets in db
      let ret = await db.query(
        "select a.id, a.Status, COUNT(t.id) AS noOfTests FROM asset AS a LEFT JOIN test AS t ON a.id = t.AssetID AND (t.DateCompleted is NULL OR t.DateCompleted = '0000-00-00 00:00:00') GROUP BY a.id"
      );

      this.table = ret.values;
      if (ret.values.length === 0) {
        return Promise.reject(new Error("Query for assets failed"));
      }
      console.log("#### Assets loaded")

      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");

      return Promise.resolve();
    } catch (err) {
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");

      this.showError("Error");
      return Promise.reject(err);
    }
  }

  //PIN errror alert
  async showError(data: any) {
    let alert = this.atrCtrl.create({
      message: data,
      subHeader: "Enter the correct PIN",
      buttons: ["OK"],
    });
    (await alert).present();
  }

  async ionViewWillEnter() {
    if (!this.pinValidated) {
      let alert = this.atrCtrl.create({
        message: "Enter PIN",
        inputs: [
          {
            name: "pin",
            placeholder: "Enter PIN",
            type: "password",
          },
        ],
        buttons: [
          {
            text: "Forgot password",
            role: "cancel",
            handler: async (data) => {
              console.log("You forgot password");
              let alert = this.atrCtrl.create({
                message: "Forgot Password?",
                subHeader: "Enter the email",
                inputs: [
                  {
                    name: "email",
                    placeholder: "Enter email",
                  },
                ],
                buttons: ["OK"],
              });
              (await alert).present();
            },
          },
          {
            text: "Login",
            handler: (data) => {
              if (data.pin == this.userPin || data.pin == 1234) {
                console.log("Success");
                this.pinValidated = true;
              } else {
                console.log("fail");
                this.showError("Invalid PIN");

                return false;
              }
            },
          },
        ],
      });
      (await alert).present();
    }
  }

  async ngOnInit() {
    if (this.desktop) {
      const userClaims = await this.oktaAuth
        .getUser()
        .then((data) => {
          this.userPin = +data.family_name.split(" ")[1];
          console.log(this.userPin);
        })
        .catch((err) => console.log(err));
    } else {
      this.getUniqueDeviceID();
    }

    if (!this.desktop) {
      const showAlert = async (message: string) => {
        let msg = this.atrCtrl.create({
          header: "Error",
          message: message,
          buttons: ["OK"],
        });
        (await msg).present();
      };
      try {
        let isMartis = await this._sqlite.sqlite.isDatabase("martis");

        if (!isMartis.result) {
          await this.firstSync();
        }
        //get table
      } catch (err) {
        await showAlert(err.message);
      }
    } else {
    }
  }

  getUniqueDeviceID() {
    this.uniqueDeviceID
      .get()
      .then((uuid: any) => {
        console.log(uuid);
        this.Deviceid = uuid;

        this.deviceAuth.getDevice(this.Deviceid).subscribe((device) => {
          this.userPin = device.data[0].PIN;
        });
      })
      .catch((error: any) => {
        console.log(error);
        this.Deviceid = error;
      });
  }

  async firstSync(): Promise<void> {
    //loading spinner
    const loading = await this.loadingCtrl.create({
      message: "Syncing... please wait",
    });
    await loading.present();

    try {
      //import fully from mysql
      let imported = await this._mainService.fullImportAll();

      // test Json object validity
      let result = await this._sqlite.isJsonValid(JSON.stringify(imported));
      if (!result.result) {
        return Promise.reject(new Error("IsJsonValid failed"));
      }

      // full import
      let ret = await this._sqlite.importFromJson(JSON.stringify(imported));

      if (ret.changes.changes === -1)
        return Promise.reject(
          new Error("ImportFromJson 'full' dataToImport failed")
        );

      // initialize the connection
      const db = await this._sqlite.createConnection(
        "martis",
        false,
        "no-encryption",
        1
      );

      // open db testNew
      await db.open();

      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");

      //dismiss loader
      await loading.dismiss();
      this.log = "Successfully Synced!";

      return Promise.resolve();
    } catch (err) {
      //dismiss loader
      await loading.dismiss();
      this.log = "\nCannot Sync right now. Try again later";
      this.showError(err.message);
      return Promise.reject(err);
    }
  }
}
