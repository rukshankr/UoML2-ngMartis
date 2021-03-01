import { Component, OnInit } from "@angular/core";
import { AlertController, Platform } from "@ionic/angular";
import { Observable } from "rxjs";
import { DatabaseService, Test } from "src/app/services/database.service";
import { inspectionListService } from "src/app/services/inspection-list.service";
@Component({
  selector: "app-inspection-list",
  templateUrl: "./inspection-list.page.html",
  styleUrls: ["./inspection-list.page.scss"],
})
export class InspectionListPage implements OnInit {
  constructor(
    private _inspectionListService: inspectionListService,
    private db: DatabaseService,
    private plt: Platform,
    private alertCtrl: AlertController
  ) {}

  lst: any = [];
  lest: Test[] = [];
  desktop: boolean = true;

  ngOnInit() {
    //this.checkPlatform();
    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
      this.db.getDatabaseState().subscribe((rdy) => {
        if (rdy) {
          this.db.getTests().subscribe((tests) => {
            this.lest = tests;
          });
        }
      });
    } else if (this.plt.is("desktop")) {
      this._inspectionListService.getinspections().subscribe((data) => {
        this.lst = data;
        this.lst = Array.of(this.lst.data);

        console.log(this.lst);
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
}
