import { Component, OnInit } from "@angular/core";
import { capSQLiteSet } from "@capacitor-community/sqlite";
import { AlertController } from "@ionic/angular";
import { InspectionService } from "src/app/services/create-inspection.service";
import { DatabaseService } from "src/app/services/database.service";
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

  ///
  oExportTest = new ExportTest();

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
    private _dbService: DatabaseService,
    private _inspectionService: InspectionService,
    private _inspectionListService: inspectionListService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async exportJson() {
    try {
      // initialize the connection
      const db = await this._sqlite.createConnection(
        "martis",
        false,
        "no-encryption",
        1
      );

      // open db martis
      await db.open();

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

      //export to Main DB
      this._dbService.fullExportAll(jsonObj.export).subscribe((data) => {
        console.log('Export post method success?: ', data);
        if (data) {
          this.showAlert("Success","Completely Exported");
        } else {
          this.showAlert("Error", "Export not added.");
        }
      });

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

export class ExportTest {
  TestID: string;
  DateIssued: string;
  AssetID: string;
  InspectorID: string;
  Result: string;
  SupervisorID: string;
  DateCompleted: string;
  Frequency: string;
  Priority: string;
  TestModID: string;
  comments: string;
}
