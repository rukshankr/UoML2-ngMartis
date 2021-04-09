import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { capSQLiteJson, capSQLiteValues } from "@capacitor-community/sqlite";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { DatabaseService } from "src/app/services/database.service";
import { SqliteService } from "src/app/services/sqlite.service";
import { deleteDatabase } from "src/assets/db-utils";
import { createSchema } from "src/assets/martis-utils";
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
  //importing
  // accessT: any;
  importJson;

  constructor(
    public atrCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private _sqlite: SqliteService,
    private plt: Platform,
    private _mainService: DatabaseService
  ) {}

  async showError(data: any) {
    let alert = this.atrCtrl.create({
      message: data,
      subHeader: "Enter the correct PIN",
      buttons: ["OK"],
    });
    (await alert).present();
  }

  async ionViewWillEnter() {
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
            if (data.pin == "1234") {
              console.log("Success");
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

  async ngOnInit() {
    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      const showAlert = async (message: string) => {
        let msg = this.atrCtrl.create({
          header: "Error",
          message: message,
          buttons: ["OK"],
        });
        (await msg).present();
      };
      try {
        await this.runDB();
        
      } catch (err) {
        await showAlert(err.message);
      }
    }
  }

  async runDB(): Promise<void> {
    //loading spinner
    const loading = await this.loadingCtrl.create({
      message: 'Syncing...'
    });
    await loading.present();
    //const synced = await loading.onDidDismiss();

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
      const db = await this._sqlite.createConnection("martis",false,"no-encryption",1);      

      // open db testNew
      await db.open();
      
    
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      
      //dismiss loader 
      await loading.dismiss();
      this.log += "Successfully Synced!";

      return Promise.resolve();
    } catch (err) {
      //dismiss loader 
      await loading.dismiss();
      this.log += "\nCannot Sync right now. Try again later";
      this.showError(err.message);
      return Promise.reject(err);
    }
  }
}
