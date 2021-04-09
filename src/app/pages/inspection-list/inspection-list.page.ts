import { Component, OnInit } from "@angular/core";
import { AlertController, Platform } from "@ionic/angular";
import { Observable } from "rxjs";
import { DatabaseService, Test } from "src/app/services/database.service";
import { inspectionListService } from "src/app/services/inspection-list.service";
import { SqliteService } from "src/app/services/sqlite.service";
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
    private alertCtrl: AlertController
  ) {}

  lst: any = [];
  lest = [];
  desktop: boolean = true;
  ////
  log: string;
  ////

  async ngOnInit() {
    const showAlert = async (message: string) => {
      let msg = this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
      });
      (await msg).present();
    };
    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
      try {
        await this.runTest();
        
      } catch (err) {
        this.log += "\n "+err.message;
        await showAlert(err.message);
      }
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

  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");
      this.log += " from Echo " + result.value;
      // initialize the connection
      const db = await this._sqlite.createConnection("martis", false, "no-encryption", 1);
      this.log +="\ndb connected " + db;

      // open db testNew
      await db.open();
      this.log += "\ndb opened";

      // select all assets in db
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
