import { Component, OnInit } from "@angular/core";
import { capSQLiteSet } from "@capacitor-community/sqlite";
import { AlertController } from "@ionic/angular";
import { inspectionListService } from "src/app/services/inspection-list.service";
import { SqliteService } from "src/app/services/sqlite.service";

@Component({
  selector: "app-syncer",
  templateUrl: "./syncer.page.html",
  styleUrls: ["./syncer.page.scss"],
})
export class SyncerPage implements OnInit {
  mainTests: any = [];
  localTests = [];
  log: string = "";
  exportedJson: string = "";

  showAlert = async (heading: string, message: string) => {
    let msg = this.alertCtrl.create({
      header: heading,
      message: message,
      buttons: ["OK"],
    });
    (await msg).present();
  };

  constructor(
    private _sqlite: SqliteService,
    private _inspectionListService: inspectionListService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async importFromMain() {
    if (this.mainTests.length !== 0) {
      try {
        let tests = [];
        let i: number;
        let ret: any;
        //connect
        const db = await this._sqlite.createConnection(
          "martis",
          false,
          "no-encryption",
          1
        );
        this.log += "\ndb connected " + db;
        //open
        await db.open();
        this.log += "\ndb opened.\n";

        //insert
        for (i = 0; i < this.mainTests[0].length; i++) {
          let sqlcmd: string =
            "INSERT OR IGNORE INTO test (TestID, DateIssued, AssetID, InspectorID, Result, SupervisorID, DateCompleted, Frequency, Priority, TestModID, comments) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
          tests = [
            this.mainTests[0][i].TestID,
            this.mainTests[0][i].DateIssued,
            this.mainTests[0][i].AssetID,
            this.mainTests[0][i].InspectorID,
            this.mainTests[0][i].Result,
            this.mainTests[0][i].SupervisorID,
            this.mainTests[0][i].DateCompleted,
            this.mainTests[0][i].Frequency,
            this.mainTests[0][i].Priority,
            this.mainTests[0][i].TestModID,
            this.mainTests[0][i].comments,
          ];
          ret = await db.run(sqlcmd, tests);
        }
        this.log += "\ninsertion successful\n";
        //disconnect
        // Close Connection MyDB
        await this._sqlite.closeConnection("martis");
        this.log += "\n> closeConnection 'martis' successful\n";

        // success message
        this.showAlert("Success", "Imported to DB");
        return Promise.resolve();
      } catch (err) {
        // Close Connection MyDB
        await this._sqlite.closeConnection("martis");
        this.log += "\n> closeConnection 'martis' successful\n";
        //error message
        this.showAlert("Failed", err);
        return Promise.reject(err);
      }
    } else {
      return this.showAlert("Failed", "main data not loaded");
    }
  }

  async exportToMain() {}

  getMainTable() {
    this._inspectionListService.getinspections().subscribe((data) => {
      this.mainTests = data;
      this.mainTests = Array.of(this.mainTests.data);
      console.log(this.mainTests);
      this.log = this.mainTests[0];
    });
    this.showAlert("Success", "tests fetched from main");
  }

  async getLocalTable(): Promise<void> {
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

      // create synchronization table
      let ret: any = await db.createSyncTable();

      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      ret = await db.query("SELECT * FROM test;");
      this.localTests = ret.values;
      if (ret.values.length === 0) {
        return Promise.reject(new Error("getTests query failed"));
      }
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      this.showAlert("Success", "tests fetched");
      return Promise.resolve();
    } catch (err) {
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      //error message
      this.showAlert("Failed", err);
      return Promise.reject(err);
    }
  }

  async exportJson() {
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

      // // create synchronization table
      // let result: any = await db.createSyncTable();

      // // set the synchronization date
      // const syncDate: string = "2020-11-25T08:30:25.000Z";
      // await db.setSyncDate(syncDate);

      this.exportedJson += "\n>>> before partial export\n";
      // export json
      let jsonObj: any = await db.exportToJson("full");

      this.exportedJson += JSON.stringify(jsonObj.export);
      // test Json object validity
      let result = await this._sqlite.isJsonValid(
        JSON.stringify(jsonObj.export)
      );

      if (!result.result) {
        return Promise.reject(new Error("IsJsonValid export 'full' failed"));
      }

      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      this.showAlert("Success", "exported");
      return Promise.resolve();
    } catch (err) {
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      //error message
      this.showAlert("Failed", err);
      return Promise.reject(err);
    }
  }
}