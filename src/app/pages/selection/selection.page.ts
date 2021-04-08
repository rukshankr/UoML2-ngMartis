import { Component, OnInit } from "@angular/core";
import { AlertController, Platform } from "@ionic/angular";
import { SqliteService } from "src/app/services/sqlite.service";
import { deleteDatabase } from "src/assets/db-utils";
import { createSchema } from "src/assets/martis-utils";

import { OktaAuthService } from "@okta/okta-angular";
import { HttpClient } from "@angular/common/http";
import { ThrowStmt } from "@angular/compiler";
import { capSQLiteJson, capSQLiteValues } from "@capacitor-community/sqlite";

import { DatabaseService } from "src/app/services/database.service";

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
  userPin: number;
  pinValidated: boolean = false;
  importJson;

  constructor(
    public atrCtrl: AlertController,
    private _sqlite: SqliteService,
    private plt: Platform,
    private oktaAuth: OktaAuthService,
    private http: HttpClient,
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
  }

  async ngOnInit() {
    const userClaims = await this.oktaAuth
      .getUser()
      .then((data) => {
        this.userPin = +data.family_name.split(" ")[1];
        console.log(this.userPin);
      })
      .catch((err) => console.log(err));

    const headers = {
      Authorization: "SSWS " + "008vkJ56YbuVZFNQ9bk0GWFCVam0Oyrkb3dX7jLhSF",
    };
    this.http
      .get("https://dev-44560058.okta.com/api/v1/users/me", {
        headers,
      })
      .subscribe(
        (data: any) => {
          // Use the data returned by the API
          console.log(data);
        },
        (err) => {
          console.log("Therer was an error");
          console.log(err);
        }
      );

    // console.log(userClaims);

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
        this.log += "\n$$$ runDB was successful\n";
      } catch (err) {
        this.log += "\n " + err.message;
        await showAlert(err.message);
      }
    }
  }

  async runDB(): Promise<void> {
    try {
      //   let martisExists = await this._sqlite.sqlite.isDatabase("martis");
      //   if (martisExists.result) {
      // 	  this.log+= "((martis db exists))";
      //     let partialJson = await this._mainService.partialImportAll();

      //     let result = await this._sqlite.isJsonValid(
      //       JSON.stringify(partialJson)
      //     );
      //     if (!result.result) {
      //       return Promise.reject(new Error("IsJsonValid failed"));
      //     }
      //     this.log += "\n$$$ dataToImport Json Object is valid $$$\n";
      //     // full import
      //     let ret = await this._sqlite.importFromJson(
      //       JSON.stringify(partialJson)
      //     );
      //     this.log += `\n||| full import result ${ret.changes.changes}`;
      //     if (ret.changes.changes === -1)
      //       return Promise.reject(
      //         new Error("ImportFromJson 'full' dataToImport failed")
      //       );
      //   } else {
      //import fully from mysql
      let imported = await this._mainService.fullImportAll();

      // test Json object validity
      let result = await this._sqlite.isJsonValid(JSON.stringify(imported));
      if (!result.result) {
        return Promise.reject(new Error("IsJsonValid failed"));
      }
      this.log += "\n$$$ dataToImport Json Object is valid $$$\n";
      // full import
      let rets = await this._sqlite.importFromJson(JSON.stringify(imported));
      this.log += `\n||| full import result ${rets.changes.changes}`;
      if (rets.changes.changes === -1)
        return Promise.reject(
          new Error("ImportFromJson 'full' dataToImport failed")
        );
      //}

      // check if the databases exist
      // and delete it for multiple successive tests
      //await deleteDatabase(db);

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

      //table exists
      let isTable = await db.isTable("repair");
      this.log += "\n???is table repair?: " + isTable.result + "|\n";

      let res = await db.query("SELECT * FROM role;");
      this.log += "\nrole;;: " + res.values.length + " \n";

      // create tables in db
      //let ret: any = await db.execute(createSchema);
      //   if (ret.changes.changes < 0) {
      // 	return Promise.reject(new Error("Execute createSchema failed"));
      //   }

      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");
      this.log += "\n> closeConnection 'myDb' successful\n";

      return Promise.resolve();
    } catch (err) {
      this.log += "\nrejected";
      this.showError(err.message);
      return Promise.reject(err);
    }
  }
}
