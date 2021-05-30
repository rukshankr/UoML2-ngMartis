import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { OktaAuthService } from "@okta/okta-angular";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import { DeviceAuthService } from "../services/device-auth.service";
import { SqliteService } from "../services/sqlite.service";
import { NetworkService } from "../services/network.service";

@Component({
  selector: "app-secure",
  templateUrl: "./login-comp.component.html",
  styleUrls: ["./login-comp.component.scss"],
})
export class LoginComponent implements OnInit {
  desktop: boolean = true;
  Deviceid;
  availableDevice;
  firstTimeLogin = true;

  constructor(
    private oktaAuth: OktaAuthService,
    router: Router,
    private plt: Platform,
    private uniqueDeviceID: UniqueDeviceID,
    private deviceAuth: DeviceAuthService,
    private loadingController: LoadingController,
    private _sqlite: SqliteService,
    private network: NetworkService,
    private alertCtrl: AlertController
  ) {}

  isAuthenticated: boolean;
  async ngOnInit() {
    this.desktop =
      this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")
        ? false
        : true;
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.desktop == false) {
      this.getUniqueDeviceID();
    }
    this.network.onNetworkChange().subscribe((data) => {
      console.log("NetStat:" + this.network.getCurrentNetworkStatus());
    });
  }

  login() {
    this.oktaAuth.signInWithRedirect({
      originalUri: "/selection",
    });
  }

  async getUniqueDeviceID() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
      duration: 2000,
    });
    await loading.present();
    this.uniqueDeviceID
      .get()
      .then( async (uuid: any) => {
        console.log(uuid);
        this.Deviceid = uuid;

        if(!this.desktop && (this.network.getCurrentNetworkStatus() == 1)){
          try{
            // initialize the connection
            const db = await this._sqlite.createConnection("martis",false,"no-encryption",1);

            // open db martis
            await db.open();

            //query for id
            let res = await db.query(`SELECT * 
            FROM device 
            WHERE id = ?`, [this.Deviceid]);

            //check query
            console.log('@@vals: '+res.values.length);
            if(res.values.length == 0){
              this.firstTimeLogin = true;
              throw new Error('Please try again with a network connection');
            }
            else{
              this.firstTimeLogin = false;
            }

            // Close Connection MyDB
            await this._sqlite.closeConnection("martis");

            return;
          }
          catch(err){
            // Close Connection MyDB
            if((await this._sqlite.sqlite.isConnection("matis")).result){
              await this._sqlite.closeConnection("martis");
            }
            this.alertCtrl.create({
              header: "Error",
              message: err.message
            }).then((res) => res.present());
          }
        }
        else{
          this.deviceAuth.getDevice(this.Deviceid).subscribe((device) => {
            this.availableDevice = device.data[0].PIN;
            if (device == null) {
              this.firstTimeLogin = true;
            } else {
              this.firstTimeLogin = false;
            }
            loading.onDidDismiss();
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.Deviceid = error;
      });
  }
}
