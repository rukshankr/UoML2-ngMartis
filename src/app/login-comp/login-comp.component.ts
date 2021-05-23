import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { LoadingController, Platform } from "@ionic/angular";

import { OktaAuthService } from "@okta/okta-angular";

import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import { DeviceAuthService } from "../services/device-auth.service";

@Component({
  selector: "app-secure",
  // template: `
  //   <!-- Container to inject the Sign-In Widget -->
  //   <div id="okta-signin-container"></div>
  // `,
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
    private loadingController: LoadingController
  ) {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
      duration: 2000,
    });
    await loading.present();

    await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  isAuthenticated: boolean;
  async ngOnInit() {
    this.desktop =
      this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")
        ? false
        : true;
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();

    if (this.desktop == false) {
      this.presentLoading();
      this.getUniqueDeviceID();
    }
  }
  //   this.widget.showSignInAndRedirect().catch((err) => {
  //     throw err;
  //   });
  // }

  login() {
    this.oktaAuth.signInWithRedirect({
      originalUri: "/selection",
    });
  }

  getUniqueDeviceID() {
    this.uniqueDeviceID
      .get()
      .then((uuid: any) => {
        console.log(uuid);
        this.Deviceid = uuid;

        this.deviceAuth.getDevice(this.Deviceid).subscribe((device) => {
          this.availableDevice = device.data[0].PIN;
          if (device == null) {
            this.firstTimeLogin = true;
          } else {
            this.firstTimeLogin = false;
          }
        });
      })
      .catch((error: any) => {
        console.log(error);
        this.Deviceid = error;
      });
  }
}
