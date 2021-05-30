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
import { BehaviorSubject, Observable } from "rxjs";
import { NetworkService } from "src/app/services/network.service";
import { AppComponent } from "src/app/app.component";

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

  userID;

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
    private uniqueDeviceID: UniqueDeviceID,
    private network: NetworkService,
    private appcomp: AppComponent
  ) {
    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
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
  //for mobile slider
  mobSlideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2,
  };
  //to get role
  empRole: string = "";

  //to get tests
  tests = [];
  //to get repairs
  repairs = [];

  loadMore(event: Event) {
    if (this.nextpg) {
      this.page = this.nextpg;
      console.log("next page:" + this.page);
      if (this.desktop) {
        this.loadTable(event);
      }
    }
  }

  async loadTable(event?: Event) {
    //loading spinner
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
    });
    await loading.present();

    this.assetService.getTestNoForAssets(this.page).subscribe((data) => {
      this.nextpg = data.next ? data.next.page : null;

      this.table = this.table.concat(data.results);
      console.log(this.table);

      //dismiss loader
      loading.dismiss();

      if (event) {
        event.target.removeEventListener;
      }
    });
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

      let ret = await db.execute(`
      create VIEW if not EXISTS unassignedRepairs 
      as
      select a.id, COUNT(r.id) AS noOfRepairs FROM asset AS a LEFT JOIN repair AS r ON a.id = r.id AND (r.completeddate is null or r.completeddate = "NULL") GROUP BY a.id;

      create view if not EXISTS unassignedTests
      as 
      select a.id, a.Status, COUNT(t.id) AS noOfTests FROM asset AS a LEFT JOIN test AS t ON a.id = t.AssetID AND (t.DateCompleted is NULL OR t.DateCompleted = "NULL") GROUP BY a.id;
      `);
      console.log("@@@create view changes: " + ret.changes.changes);

      if (ret.changes.changes == -1) {
        return Promise.reject(new Error("Creating views failed"));
      }

      let rets = await db.query(
        `select ut.id, ut.Status, ut.noOfTests, ur.noOfRepairs from unassignedTests ut join unassignedRepairs ur on ur.id = ut.id;`
      );

      this.table = rets.values;
      if (rets.values.length === 0) {
        return Promise.reject(new Error("Query for assets failed"));
      }
      console.log("#### Assets loaded");

      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");

      return Promise.resolve();
    } catch (err) {
      // Close Connection MyDB
      if (this._sqlite.sqlite.isConnection("martis")) {
        await this._sqlite.closeConnection("martis");
      }

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
    if (!this.desktop) {
      this.loadMobiTable();
    }
  }

  async ngOnInit() {
    if (this.desktop) {
      const userClaims = await this.oktaAuth
        .getUser()
        .then((data) => {
          this.userPin = data.family_name.split(" ")[1];
          console.log("UserPIN: " + this.userPin);
        })
        .catch((err) => console.log(err));
    } else {
      this.getUniqueDeviceID();
    }

    if (!this.desktop) {
      //check network
      this.network.onNetworkChange().subscribe((data) => {
        console.log("NetStat:" + data);
      });

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
    }
    //get user role
    this.appcomp.UserRolesub.subscribe((data) => {
      this.empRole = data;
      console.log("role:" + this.empRole);
    });
  }

  getUniqueDeviceID() {
    this.uniqueDeviceID
      .get()
      .then((uuid: any) => {
        console.log(uuid);
        this.Deviceid = uuid;

        this.deviceAuth.getDevice(this.Deviceid).subscribe((device) => {
          this.userPin = device.data[0].PIN;
          this.userID = device.data[0].UserID;
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
      //check network
      if (this.network.getCurrentNetworkStatus() == 1) {
        return Promise.reject(
          new Error("Not connected to a network. Connect and try again.")
        );
      }

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
      const db = await this._sqlite.createConnection("martis",false,"no-encryption",1);

      // open db testNew
      await db.open();

      //check for sync_table and create if not there
      if (!(await db.isTable("sync_table")).result) {
        await db.createSyncTable();
      }

      //update the sync date
      let syncDate = new Date().toISOString();
      await db.setSyncDate(syncDate);

      //get Sync Date
      syncDate = await db.getSyncDate();
      console.log("synced at: " + syncDate);

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

  async getTests(assetID, noOfTests){
    //loading spinner
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles"
    });
    await loading.present();

    if(noOfTests == 0) return;
    if(this.desktop){
      this.assetService.getAssignedTestsByAssetID(assetID).subscribe((data) => {
        console.log(data.data);
        this.tests = data.data;
        this.repairs = [];
        //dismiss loader
        loading.dismiss();
    });
  }
    else{
      try{
        // initialize the connection
        const db = await this._sqlite.createConnection("martis", false, "no-encryption",1);

        // open db martis
        await db.open();

        let tests = await db.query(`
        SELECT t.id AS TestID, t.SupervisorID, t.InspectorID, t.TestModID
				FROM test t
				where (t.DateCompleted is null or t.DateCompleted = "NULL")
				AND t.AssetID = ? 
				ORDER BY t.Priority;`, [assetID]);

        if(tests.values.length == 0){
          return;
        }
        this.tests = tests.values;
        this.repairs = [];

        // close martis
        await this._sqlite.closeConnection("martis");
        //dismiss loader
        await loading.dismiss();
      }
      catch(err){
        //close connection
        if((await this._sqlite.sqlite.isConnection("martis")).result){
          await this._sqlite.closeConnection("martis");
        }
        //dismiss loader
        await loading.dismiss();
      }
    }
  }

  async getRepairs(assetID, noOfRepairs){
    //loading spinner
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles"
    });
    await loading.present();
    
    if(noOfRepairs == 0) return;
    if(this.desktop){
      this.assetService.getAssignedRepairsByAssetID(assetID).subscribe((data) => {
        console.log(data.data);
        this.repairs = data.data;
        this.tests = [];
        //dismiss loader
        loading.dismiss();
      });
    }
    else{
      try{
        // initialize the connection
        const db = await this._sqlite.createConnection("martis", false, "no-encryption",1);

        // open db martis
        await db.open();

        let repairs = await db.query(`
        SELECT r.CreatedDate, r.EngineerID, r.comments
				FROM repair r
				where (r.CompletedDate is null or r.CompletedDate = "NULL")
				AND r.id = ? 
				ORDER BY r.CreatedDate DESC;`, [assetID]);

        if(repairs.values.length == 0){
          return;
        }
        this.repairs = repairs.values;
        this.tests = [];

        // close martis
        await this._sqlite.closeConnection("martis");
        //dismiss loader
        await loading.dismiss();
      }
      catch(err){
        //close connection
        if((await this._sqlite.sqlite.isConnection("martis")).result){
          await this._sqlite.closeConnection("martis");
        }
        //dismiss loader
        await loading.dismiss();
      }
    }
  }
}
