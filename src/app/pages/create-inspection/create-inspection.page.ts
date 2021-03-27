import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { InspectionService } from "src/app/services/create-inspection.service";
import { AlertController } from "@ionic/angular";
import { SqliteService } from "src/app/services/sqlite.service";
//import { DatePipe } from '@angular/common';

@Component({
  selector: "app-create-inspection",
  templateUrl: "./create-inspection.page.html",
  styleUrls: ["./create-inspection.page.scss"],
})
export class CreateInspectionPage implements OnInit {
  results: object[];
  assets = [];
  log: string = "";

  opost = new Posts();

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
    ]
  };

  createInspectionForm = this.formBuilder.group({
    TestID: ["", [Validators.required, Validators.pattern("^T[0-9]{3}")]],
    AssetID: [""],
    InspectorID: [
      "",
      [Validators.required, Validators.pattern("^EMP[0-9]{3}")],
    ],
    SupervisorID: [
      "",
      [Validators.required, Validators.pattern("^EMP[0-9]{3}")],
    ],
    Frequency: [""],
    TestModuleID: [
      "",
      [Validators.required, Validators.pattern("^TM[0-9]{3}")],
    ],
    Priority: [""],
  });

  constructor(
    private formBuilder: FormBuilder,
    private inspectionService: InspectionService,
    private _sqlite: SqliteService,
    private alertCtrl: AlertController
  ) //private datePipe: DatePipe
  {}

  async ngOnInit() {
    const showAlert = async (message: string) => {
      let msg = this.alertCtrl.create({
        header: "Error",
        message: message,
        buttons: ["OK"],
      });
      (await msg).present();
    };
    try {
      // initialize the connection
      const db = await this._sqlite.createConnection(
        "martis",
        false,
        "no-encryption",
        1
      );
      this.log += "\ndb connected " + db;


      // open db testNew
      await db.open();
      this.log += "\ndb opened";

      // select all assets in db
      let ret = await db.query("SELECT * FROM asset;");
      this.assets = ret.values;
      if (ret.values.length === 0) {
        return Promise.reject(new Error("Query 2 asset failed"));
      }
      this.log += "\nquery done.";
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      this.log += "\n> closeConnection 'myDb' successful\n";

      return Promise.resolve();
    } catch (err) {
		this.log += "\nrejected";
		//error message
		await showAlert(err.message);
    	return Promise.reject(err);
	}
  }

  async onSave() {
    const showAlert = async (message: string) => {
      let msg = this.alertCtrl.create({
        header: "Error",
        message: message,
        buttons: ["OK"],
      });
      (await msg).present();
    };
    try {
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
      let sqlcmd: string =
        "INSERT INTO test (TestID, DateIssued, AssetID, InspectorID, SupervisorID, Frequency, TestModID, Priority) VALUES (?,?,?,?,?,?,?,?)";
      this.opost = this.createInspectionForm.value;

      //put today
      let date = new Date();
      //let today = this.datePipe.transform(date, 'yyyy-MM-dd hh:mm:ss').toString();

      var p = this.opost;
      let postableChanges = [
        p.TestID,
        date,
        p.AssetID,
        p.InspectorID,
        p.SupervisorID,
        p.Frequency,
        p.TestModuleID,
        p.Priority,
      ];
      let ret: any = await db.run(sqlcmd, postableChanges);

      //check insert
      if (ret.changes.changes !== 1) {
        return Promise.reject(new Error("Execution failed"));
      }
      this.log += "\ninsertion successful\n";
      //disconnect
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      this.log += "\n> closeConnection 'myDb' successful\n";

      await showAlert("asset added.");
      return Promise.resolve();
    } catch (err) {
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      this.log += "\n> closeConnection 'myDb' successful\n";
      //error message
      await showAlert(err.message);
    }
    //===========================
    // this.opost = this.createInspectionForm.value;

    // console.log('Page Saved', this.opost);

    // this.inspectionService.post(this.opost).subscribe((data) => {
    // 	console.log('Post method success?: ', data);
    // 	if (data) {
    // 		this.showAlert(true);
    // 	} else {
    // 		this.showAlert(false);
    // 	}
    // });
    // async showAlert(val) {
    // 	await this.alertCtrl
    // 		.create({
    // 			header: 'Result',
    // 			message: val ? 'Test added Sucessfully' : 'Error',
    // 			buttons: [
    // 				{
    // 					text: 'OK',
    // 					handler: () => {
    // 						this.createInspectionForm.reset();
    // 					}
    // 				}
    // 			]
    // 		})
    // 		.then((res) => res.present());
    // }
  }
}

export class Posts {
  TestID: string;
  AssetID: string;
  InspectorID: string;
  SupervisorID: string;
  Frequency: string;
  TestModuleID: string;
  Priority: string;
}
