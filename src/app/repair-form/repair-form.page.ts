import { Component, OnInit } from "@angular/core";
import { AlertController, Platform } from "@ionic/angular";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { CreateRepairService } from "src/app/services/create-repair.service";
import { SqliteService } from "../services/sqlite.service";
import { AppComponent } from "../app.component";

@Component({
  selector: "app-repair-form",
  templateUrl: "./repair-form.page.html",
  styleUrls: ["./repair-form.page.scss"],
})
export class RepairFormPage implements OnInit {
  results: object[];

  //autofill elements
  assetid: String;
  engineerid: String;
  comments: String;
  createddate = String;
  opost = new Posts();
  log: string = "";

  //platform
  desktop: boolean = true;

  //confirmation
  confirm: boolean = false;

  createRepairForm = this.formBuilder.group({
    AssetId: [
      "",
      [
        Validators.required,
        Validators.pattern("^A[0-9]{3}"),
        Validators.maxLength(4),
      ],
    ],
    EngineerID: ["", [Validators.required, Validators.pattern("^EMP[0-9]{3}")]],
    CreatedDate: ["", [Validators.required]],
    CompletedDate: ["", [Validators.required]],
    comments: [""],
    Result: ["", [Validators.required]],
  });

  get createdDate() {
    return this.createRepairForm.get("CreatedDate");
  }

  get completedDate() {
    return this.createRepairForm.get("CompletedDate");
  }

  ngOnInit() {
    this.app.UserIDsub.subscribe((data) => {
      this.engineerid = data;
      console.log(this.engineerid);
    });
    console.log(this.route.snapshot.params.assetid);
    let date = new Date(this.route.snapshot.params.createddate);
    console.log(date);
    this.assetid = this.route.snapshot.params.assetid;
    //this.engineerid = this.route.snapshot.params.engineerid;
    this.comments = this.route.snapshot.params.comments;
    this.createddate = this.route.snapshot.params.createddate;
    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
    } else if (this.plt.is("desktop")) {
      this.desktop = true;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private setRepair: CreateRepairService,
    private alertCtrl: AlertController,
    private _sqlite: SqliteService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private plt: Platform,
    private app: AppComponent
  ) {}

  async onSave() {
    let date = this.route.snapshot.params.createddate;
    this.opost = this.createRepairForm.value;
    if (this.opost.CompletedDate == "" || this.confirm === false) {
      this.showAlert(false, "Please confirm repair date", true);
      return;
    }
    if (!this.desktop) {
      this.opost.CreatedDate = date;
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
        console.log(
          " // db opened // ComD8:" +
            this.opost.CreatedDate +
            ", comments:" +
            this.opost.comments +
            ", id:" +
            this.opost.AssetId +
            ", completedD8:" +
            this.completedDate
        );
        //update
        let sqlcmd: string =
          "UPDATE repair SET CompletedDate = ?, comments = ?, last_modified = (strftime('%s', 'now')) WHERE id = ? AND CreatedDate = ?";

        let postableChanges = [
          this.completedDate.value,
          this.opost.comments,
          this.opost.AssetId,
          this.opost.CreatedDate,
        ];
        let ret: any = await db.run(sqlcmd, postableChanges);

        console.log(" // query run //" + ret.changes.changes);

        //check insert
        if (ret.changes.changes == 0) {
          return Promise.reject(new Error("Execution failed"));
        }
        this.log += "\n update successful: changes: ";
        //disconnect martis
        await this._sqlite.closeConnection("martis");
        this.log += "\n> closeConnection 'martis' successful\n";
        await this.showAlert(true);
        return Promise.resolve();

        await this.showAlert(true);
        return Promise.resolve();
      } catch (err) {
        // Close Connection MyDB
        if (this._sqlite.sqlite.isConnection("martis")) {
          await this._sqlite.closeConnection("martis");
        }

        this.log += "\n> closeConnection 'martis' successful\n";
        //error message
        return await this.showAlert(false, err.message, true);
      }
    }
    this.opost.CreatedDate = this.datePipe
      .transform(date, "yyyy-MM-dd HH:mm:ss", "utc")
      .toString();
    this.opost.CompletedDate = this.datePipe.transform(
      this.opost.CompletedDate,
      "yyyy-MM-dd HH:mm:ss"
    );
    console.log(this.opost.CompletedDate);
    console.log("Page Saved", this.opost);
    this.setRepair.put(this.opost).subscribe((data) => {
      console.log("Post method success?: ", data);
      if (data) {
        this.showAlert(true);
      } else {
        this.showAlert(false);
      }
    });
  }

  async showAlert(val, msg?, reset?: boolean) {
    await this.alertCtrl
      .create({
        header: val ? "Successful" : "Unsuccessful",
        message: val ? "Repair added Successfully" : "Error: " + msg,
        buttons: [
          {
            text: "OK",
            handler: () => {
              if (!reset) {
                this.createRepairForm.reset();
              }
            },
          },
        ],
      })
      .then((res) => res.present());
  }

  confirmer() {
    this.confirm = !this.confirm;
  }
}
export class Posts {
  AssetId: string;
  EngineerID: string;
  CreatedDate: string;
  CompletedDate: string;
  comments: string;
  Result: string;
}
