import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { InspectionService } from "src/app/services/create-inspection.service";
import { AlertController, Platform } from "@ionic/angular";
import { SqliteService } from "src/app/services/sqlite.service";
import { AssetService } from "src/app/services/asset-service.service";
import { DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-create-inspection",
  templateUrl: "./create-inspection.page.html",
  styleUrls: ["./create-inspection.page.scss"],
})
export class CreateInspectionPage implements OnInit {
  assetid: string;
  testid: string;
  results: object[];
  assets: any = [];
  log: string = "";
  empId;
  empRole;
  Inspectors: any = [];
  Managers: any = [];

  opost = new Posts();

  //platform check
  desktop: boolean = true;

  get testId() {
    return this.createInspectionForm.get("TestID");
  }
  get insId() {
    return this.createInspectionForm.get("InspectorID");
  }
  get supId() {
    return this.createInspectionForm.get("SupervisorID");
  }
  get assetId() {
    return this.createInspectionForm.get("AssetID");
  }

  public errorMessage = {
    testID: [
      { type: "required", message: "Test ID is required" },
      { type: "pattern", message: "Must be in the form: T000" },
    ],
    empID: [
      { type: "required", message: "Employee ID is required" },
      { type: "pattern", message: "Must be in the form: EMP000" },
    ],
  };

  createInspectionForm = this.formBuilder.group({
    TestID: ["", [Validators.required, Validators.pattern("^T[0-9]{3}")]],
    AssetID: ["", [Validators.required]],
    InspectorID: [
      "",
      [Validators.required, Validators.pattern("^EMP[0-9]{3}")],
    ],
    SupervisorID: [
      "",
      [Validators.required, Validators.pattern("^EMP[0-9]{3}")],
    ],
    Frequency: ["", [Validators.required]],
    TestModID: ["", [Validators.required, Validators.pattern("^TM[0-9]{3}")]],
    Priority: ["", [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private inspectionService: InspectionService,
    private _sqlite: SqliteService,
    private alertCtrl: AlertController,
    private plt: Platform,
    private _assetService: AssetService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private appcomp: AppComponent
  ) {}

  showAlert = async (heading: string, message: string) => {
    let msg = this.alertCtrl.create({
      header: heading,
      message: message,
      buttons: ["OK"],
    });
    (await msg).present();
  };

  async ngOnInit() {
    this.appcomp.UserIDsub.subscribe((data) => {
      this.empId = data;
    });
    this.appcomp.UserRolesub.subscribe((data) => {
      this.empRole = data;
    });

    this.assetid = this.route.snapshot.params.id;

    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
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
        let ret = await db.query("SELECT id as 'AssetID' FROM asset;");
        this.assets = ret.values;
        if (ret.values.length === 0) {
          return Promise.reject(new Error("Query for assets failed"));
        }

        // Close Connection MyDB
        await this._sqlite.closeConnection("martis");

        return Promise.resolve();
      } catch (err) {
        //error message
        await this.showAlert("Error", err.message);
        //disconnect martis
        if (this._sqlite.sqlite.isConnection("martis")) {
          await this._sqlite.closeConnection("martis");
        }
        return Promise.reject(err);
      } finally {
        this.getLatestTestIncrement();
      }
    } else if (this.plt.is("desktop")) {
      this.desktop = true;

      this.inspectionService.getInspectors().subscribe((data) => {
        this.Inspectors = data.data;
        console.log(this.Inspectors);
      });

      this._assetService.getAssets().subscribe((data) => {
        this.assets = data;
        this.assets = Array.of(this.assets.data);
        this.inspectionService.getLatestTest().subscribe((data) => {
          this.testid = data.data[0].TestID;
          let num =
            parseInt(this.testid[1] + this.testid[2] + this.testid[3]) + 1;
          this.testid = this.testid[0] + num.toString();
        });
      });
    }
  }

  async onSave() {
    if (!this.desktop) {
      try {
        //connect
        const db = await this._sqlite.createConnection(
          "martis",
          false,
          "no-encryption",
          1
        );

        //open
        await db.open();

        //insert
        let sqlcmd: string =
          "INSERT INTO test (id, DateIssued, AssetID, InspectorID, SupervisorID, Frequency, TestModID, Priority, last_modified) VALUES (?,?,?,?,?,?,?,?, (strftime('%s', 'now')))";
        this.opost = this.createInspectionForm.value;

        //put today
        let date = new Date();

        var p = this.opost;
        let postableChanges = [
          p.TestID,
          date,
          p.AssetID,
          p.InspectorID,
          p.SupervisorID,
          p.Frequency,
          p.TestModID,
          p.Priority,
        ];
        let ret: any = await db.run(sqlcmd, postableChanges);

        //check insert
        if (ret.changes.changes !== 1) {
          return Promise.reject(new Error("Execution failed"));
        }

        //disconnect
        await this._sqlite.closeConnection("martis");

        await this.showAlert("Success", "Inspection added.");
        return Promise.resolve();
      } catch (err) {
        // Close Connection MyDB
        await this._sqlite.closeConnection("martis");

        //error message
        return await this.showAlert("Error", err.message);
      }
    }

    this.opost = this.createInspectionForm.value;
    let today = new Date();
    this.opost.DateIssued = this.datePipe
      .transform(today, "yyyy-MM-dd HH:mm:ss")
      .toString();

    console.log("Page Saved", this.opost);

    this.inspectionService.post(this.opost).subscribe((data) => {
      console.log("Post method success?: ", data);
      if (data) {
        this.showAlert("Success", "inspection added.");
      } else {
        this.showAlert("Error", "Inspection not added.");
      }
    });
  }

  async getLatestTestIncrement() {
    try {
      //connect
      const db = await this._sqlite.createConnection(
        "martis",
        false,
        "no-encryption",
        1
      );

      //open
      await db.open();

      //query
      let sqlcmd: string = "SELECT id FROM test ORDER BY id DESC limit 1;";
      let ret: any = await db.query(sqlcmd);

      //check insert
      if (ret.values.length === 0) {
        return Promise.reject(new Error("Query failed"));
      }

      console.log("last asset: " + ret.values[0].id);

      //disconnect
      await this._sqlite.closeConnection("martis");

      this.testid = ret.values[0].id;
      let num = parseInt(this.testid[1] + this.testid[2] + this.testid[3]) + 1;
      this.testid = this.testid[0] + num.toString();

      return Promise.resolve();
    } catch (err) {
      //disconnect martis
      if (this._sqlite.sqlite.isConnection("martis")) {
        await this._sqlite.closeConnection("martis");
      }
      return Promise.reject();
    }
  }
}

export class Posts {
  TestID: string;
  DateIssued: string;
  AssetID: string;
  InspectorID: string;
  SupervisorID: string;
  Frequency: string;
  TestModID: string;
  Priority: string;
}
