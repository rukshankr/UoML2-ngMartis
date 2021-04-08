import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SqliteService } from "./services/sqlite.service";

import { Router } from "@angular/router";
import { OktaAuthService } from "@okta/okta-angular";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  public userRole: string;
  public userName: string;
  private initPlugin: boolean;
  public isAuthenticated: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _sqlite: SqliteService,
    public oktaAuth: OktaAuthService,
    private router: Router
  ) {
    this.initializeApp();
    this.isAuthenticated = false;
    this.oktaAuth.$authenticationState.subscribe((auth) => {
      this.isAuthenticated = auth;
    });
  }
  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    //console.log(this.isAuthenticated);
    const userClaims = await this.oktaAuth
      .getUser()
      .then((data) => {
        console.log(data);
        this.userRole = data.family_name.split(" ")[0];
        this.userName = data.given_name;
        console.log(this.userRole);
        console.log(this.userName);
      })
      .catch((err) => console.log(err));
  }

  async logout() {
    await this.oktaAuth.signOut();
    this.router.navigateByUrl("/login");
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this._detail.setExistingConnection(false);
      //this._detail.setExportJson(false);
      this._sqlite.initializePlugin().then((ret) => {
        this.initPlugin = ret;
        console.log(">>>> in App  this.initPlugin " + this.initPlugin);
      });
    });
  }
}
