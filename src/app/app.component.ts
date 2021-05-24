import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SqliteService } from "./services/sqlite.service";

import { Router } from "@angular/router";
import { OktaAuthService } from "@okta/okta-angular";
import { DeviceAuthService } from "./services/device-auth.service";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import { BehaviorSubject } from "rxjs";

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
  public desktop: boolean = true;
  public Deviceid;
  public EmpId;

  UserID: BehaviorSubject<string> = new BehaviorSubject("");
  UserIDsub = this.UserID.asObservable();
  UserRole: BehaviorSubject<string> = new BehaviorSubject("");
  UserRolesub = this.UserRole.asObservable();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _sqlite: SqliteService,
    public oktaAuth: OktaAuthService,
    private deviceAuth: DeviceAuthService,
    private router: Router,
    private uniqueDeviceID: UniqueDeviceID
  ) {
    this.initializeApp();
    this.isAuthenticated = false;
    this.oktaAuth.$authenticationState.subscribe((auth) => {
      this.isAuthenticated = auth;
    });
  }

  refresh() {
    this.getUniqueDeviceID();
  }

  async ngOnInit() {
    this.desktop =
      this.platform.is("mobile") ||
      this.platform.is("android") ||
      this.platform.is("ios")
        ? false
        : true;
    if (this.desktop) {
      this.isAuthenticated = await this.oktaAuth.isAuthenticated();
      console.log(this.isAuthenticated);
      const userClaims = await this.oktaAuth
        .getUser()
        .then((data) => {
          console.log(data);
          this.userRole = data.family_name.split(" ")[0];
          this.UserRole.next(this.userRole);
          this.EmpId = data.family_name.split(" ")[2];
          this.UserID.next(this.EmpId);
          this.userName = data.given_name;
        })
        .catch((err) => console.log(err));
    } else {
      this.getUniqueDeviceID();
    }
  }

  async logout() {
    await this.oktaAuth.signOut();
    this.router.navigateByUrl("/login");
  }

  getUniqueDeviceID() {
    this.uniqueDeviceID
      .get()
      .then((uuid: any) => {
        console.log(uuid);
        this.Deviceid = uuid;

        this.deviceAuth.getDevice(this.Deviceid).subscribe((device) => {
          this.EmpId = device.data[0].UserID;
          this.UserID.next(this.EmpId);

          this.deviceAuth.getUserNameAndRole(this.EmpId).subscribe((user) => {
            this.userName = user.data[0].Name;
            this.userRole = user.data[0].Title;
            this.UserRole.next(this.userRole);
          });
        });
      })
      .catch((error: any) => {
        console.log(error);
        this.Deviceid = error;
      });
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this._sqlite.initializePlugin().then((ret) => {
        this.initPlugin = ret;
        console.log(">>>> in App  this.initPlugin " + this.initPlugin);
      });
    });
  }
}
