import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Platform } from "@ionic/angular";

import { OktaAuthService } from "@okta/okta-angular";
import * as OktaSignIn from "@okta/okta-signin-widget";

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
  firstTimeLogin;

  authService;
  widget = new OktaSignIn({
    el: "#okta-signin-container",
    baseUrl: "https://dev-44560058.okta.com",
    authParams: {
      pkce: true,
    },
    clientId: "0oag5ujmllTDi2zrM5d6",
    redirectUri: "https://martiswabtec.web.app/login/callback",
    postLogoutRedirectUri: "https://martiswabtec.web.app/login",
  });

  constructor(
    private oktaAuth: OktaAuthService,
    router: Router,
    private plt: Platform,
    private uniqueDeviceID: UniqueDeviceID,
    private deviceAuth: DeviceAuthService
  ) {
    this.authService = oktaAuth;
    //Show the widget when prompted, otherwise remove it from the DOM.
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        switch (event.url) {
          case "/login":
            break;
          case "/test":
            break;
          default:
            this.widget.remove();
            break;
        }
      }
    });
  }

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
