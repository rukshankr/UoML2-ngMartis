import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { InspectionService } from "src/app/services/create-inspection.service";
import { AlertController, Platform } from "@ionic/angular";
import { SqliteService } from "src/app/services/sqlite.service";
import { AssetService } from "src/app/services/asset-service.service";
import { DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { Subscription } from "rxjs";
import { NetworkService } from "src/app/services/network.service";

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

  getInspectorsSub: Subscription;
  getManagerSub: Subscription;
  userIDSub: Subscription;
  userRoleSub: Subscription;
  getAssetsSub: Subscription;
  saveFormSub: Subscription;
  getLatestTestSub: Subscription;

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
    private appcomp: AppComponent,
    private network: NetworkService
  ) {}

  showAlert = async (heading: string, message: string) => {
    let msg = this.alertCtrl.create({
      header: heading,
      message: message,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.createInspectionForm.reset();
            this.getLatestTestIncrement();
          },
        },
      ],
    });
    (await msg).present();
  };

  async ngOnInit() {
    this.getInspectorsSub = this.inspectionService
      .getInspectors()
      .subscribe((data) => {
        this.Inspectors = data.data;
        console.log(this.Inspectors);
      });

    this.getManagerSub = this.inspectionService
      .getManagers()
      .subscribe((data) => {
        this.Managers = data.data;
      });

    this.userIDSub = this.appcomp.UserIDsub.subscribe((data) => {
      this.empId = data;
    });

    this.userRoleSub = this.appcomp.UserRolesub.subscribe((data) => {
      this.empRole = data;
    });

    console.log(this.route.snapshot.params.id);
    this.assetid = this.route.snapshot.params.id;

    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
    } else if (this.plt.is("desktop")) {
      this.desktop = true;
    }
    if (this.network.getCurrentNetworkStatus() == 0) {
      this.getAssetsSub = this._assetService.getAssets().subscribe((data) => {
        this.assets = data;
        this.assets = Array.of(this.assets.data);
        console.log(this.assets);
      });
      this.getLatestTestIncrement();
    }
    else {
      this.showAlert("No network","Please connect to a network and load again.");
    }
  }

  async onSave() {
    if (this.network.getCurrentNetworkStatus() == 1) {
      this.showAlert("No Network", "Please connect to a network and try again.");
      return;
    }
    this.opost = this.createInspectionForm.value;
    let today = new Date();
    this.opost.DateIssued = this.datePipe
      .transform(today, "yyyy-MM-dd HH:mm:ss")
      .toString();

    console.log("Page Saved", this.opost);

    this.saveFormSub = this.inspectionService
      .post(this.opost)
      .subscribe((data) => {
        console.log("Post method success?: ", data);
        if (data.message != "Error") {
          this.showAlert("Success", "Inspection added.");
        } else {
          this.showAlert("Error", "Inspection not added.");
        }
      });
  }

  async getLatestTestIncrement() {
      this.getLatestTestSub = this.inspectionService
        .getLatestTest()
        .subscribe((data) => {
          this.testid = data.data[0].TestID;
          let num =
            parseInt(this.testid[1] + this.testid[2] + this.testid[3]) + 1;
          this.testid = this.testid[0] + num.toString();
          console.log(this.testid);
        });
  }

  ngOnDestroy() {
    if (this.getInspectorsSub) {
      this.getInspectorsSub.unsubscribe();
    }
    if (this.getManagerSub) {
      this.getManagerSub.unsubscribe();
    }
    if (this.userIDSub) {
      this.userIDSub.unsubscribe();
    }
    if (this.userRoleSub) {
      this.userRoleSub.unsubscribe();
    }
    if (this.getAssetsSub) {
      this.getAssetsSub.unsubscribe();
    }
    if (this.saveFormSub) {
      this.saveFormSub.unsubscribe();
    }
    if (this.getLatestTestSub) {
      this.getLatestTestSub.unsubscribe();
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
